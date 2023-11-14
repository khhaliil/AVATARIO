
# Importation des bibliothèques nécessaires
import os, copy, types, gc, sys
current_path = os.path.dirname(os.path.abspath(__file__))
import numpy as np
os.environ["RWKV_JIT_ON"] = '1' 
os.environ["RWKV_CUDA_ON"] = '0'

os.environ["CUDA_VISIBLE_DEVICES"] = '0'

# Importation des bibliothèques requises de PyTorch
import pickle
import torch
torch.backends.cudnn.benchmark = True
torch.backends.cudnn.allow_tf32 = True
torch.backends.cuda.matmul.allow_tf32 = True
torch._C._jit_set_profiling_executor(True)
torch._C._jit_set_profiling_mode(True)
torch._C._jit_override_can_fuse_on_gpu(True)
torch._C._jit_set_texpr_fuser_enabled(False)
torch._C._jit_set_nvfuser_enabled(False)

# Définition de la classe ChatRWKV
class ChatRWKV:
    def __init__(self):
        # Initialisation de différents paramètres et réglages
        
        # Définir le nom du modèle et la langue du chat
        self.args = types.SimpleNamespace()
         #####for local 64 GB memory ; 6 GB VRAM ; i7 cpu
        #self.args.strategy = 'cuda fp16 *12 -> cuda fp16i8 *1 -> cpu fp32'
        #####for colab V100
        #self.args.strategy = 'cuda fp16'
        ##### for vast.ai 2X RTX4000
        self.args.strategy = 'cuda fp16'
        self.args.MODEL_NAME = "tuned25"
        self.CHAT_LANG = 'Anglais'
        
        # Définir les longueurs de chat et autres paramètres
        self.CHAT_LEN_SHORT = 30
        self.CHAT_LEN_LONG = 100
        self.FREE_GEN_LEN = 128

        self.GEN_TEMP = 0.5
        self.GEN_TOP_P = 0.2
        self.GEN_alpha_presence = 0.2
        self.GEN_alpha_frequency = 0.2
        self.AVOID_REPEAT = '，：？！.,;'
        self.GEN_penalty_decay = 0.996
        self.CHUNK_LEN = 128

        self.END_OF_TEXT = 0
        self.END_OF_LINE = 187
        self.END_OF_LINE_DOUBLE = 535

        # Initialisation des tokens et de l'état du modèle
        self.model_tokens = []
        self.model_state = None

        # Création d'une liste de tokens pour éviter la répétition
        self.AVOID_REPEAT_TOKENS = []
        
        # Création d'un dictionnaire pour stocker tous les états
        self.all_state = {}
        
        # Affichage des informations de chargement du modèle
        print(f'Chargement du modèle - {self.args.MODEL_NAME}')
        self.model = RWKV(model=self.args.MODEL_NAME, strategy=self.args.strategy)
        self.pipeline = PIPELINE(self.model, f"{current_path}/20B_tokenizer.json")

        # Ajout des tokens pour éviter la répétition
        for i in self.AVOID_REPEAT:
            dd = self.pipeline.encode(i)
            assert len(dd) == 1
            self.AVOID_REPEAT_TOKENS += dd
        
    def load_prompt(self,PROMPT_FILE):
        # Fonction pour charger les instructions depuis un fichier
        variables = {}
        with open(PROMPT_FILE, 'rb') as file:
            exec(compile(file.read(), PROMPT_FILE, 'exec'), variables)
        user, bot, interface, init_prompt = variables['user'], variables['bot'], variables['interface'], variables['init_prompt']
        init_prompt = init_prompt.strip().split('\n')
        for c in range(len(init_prompt)):
            init_prompt[c] = init_prompt[c].strip().strip('\u3000').strip('\r')
        init_prompt = '\n' + ('\n'.join(init_prompt)).strip() + '\n\n'
        return user, bot, interface, init_prompt

    def run_rnn(self,tokens, newline_adj = 0):
        # Fonction pour exécuter le modèle RNN avec des tokens donnés
        tokens = [int(x) for x in tokens]
        self.model_tokens += tokens
        
        while len(tokens) > 0:
            out, self.model_state = self.model.forward(tokens[:self.CHUNK_LEN], self.model_state)
            tokens = tokens[self.CHUNK_LEN:]

        out[self.END_OF_LINE] += newline_adj # ajuster la probabilité de \n

        if self.model_tokens[-1] in self.AVOID_REPEAT_TOKENS:
            out[self.model_tokens[-1]] = -999999999
        return out

    def save_all_stat(self, srv, name, last_out, user_id, discussion_id):
        # Fonction pour sauvegarder tous les états du modèle
        n = f'{name}_{srv}'
        self.all_state[n] = {}
        self.all_state[n]['out'] = last_out
        self.all_state[n]['rnn'] = copy.deepcopy(self.model_state)
        self.all_state[n]['token'] = copy.deepcopy(self.model_tokens)
        
        current_path = os.getcwd()
        directory = os.path.join(current_path,'users', user_id, discussion_id)
        os.makedirs(directory, exist_ok=True)
        file_path = os.path.join(directory, f'{n}.pkl')

        with open(file_path, 'wb') as f:
            pickle.dump(self.all_state[n], f)

    def load_all_stat(self, srv, name,user_id,discussion_id):
        # Fonction pour charger tous les états du modèle à partir d'un fichier
        n = f'{name}_{srv}'
        with open(f'{current_path}/users/{user_id}/{discussion_id}/{n}.pkl', 'rb') as f:
            self.all_state[n] = pickle.load(f) 
        self.model_state = copy.deepcopy(self.all_state[n]['rnn'])
        self.model_tokens = copy.deepcopy(self.all_state[n]['token'])
   
        return self.all_state[n]['out']

    def fix_tokens(self,tokens):
        # Fonction pour corriger les tokens
        if len(tokens) > 0 and tokens[-1] == self.END_OF_LINE_DOUBLE:
            tokens = tokens[:-1] + [self.END_OF_LINE, self.END_OF_LINE]
        return tokens

    def on_message(self,message,user_id,discussion_id,prompt_file):
        # Fonction principale pour traiter les messages de l'utilisateur et générer des réponses

        # Charger les instructions à partir du fichier PROMPT_FILE
        self.PROMPT_FILE = f'{current_path}/instructions/{prompt_file}.py'
        self.user, self.bot, self.interface, self.init_prompt = self.load_prompt(self.PROMPT_FILE)
        srv = 'dummy_server'

        # Traiter le message de l'utilisateur
        msg = message.replace('\\n','\n').strip()
        x_temp = self.GEN_TEMP
        x_top_p = self.GEN_TOP_P
        msg = msg.strip()

        # Si l'état du modèle n'a pas été sauvegardé, exécuter le modèle avec les instructions initiales
        if not os.path.exists(f"{current_path}/users/{user_id}/{discussion_id}/chat_{srv}.pkl"):
            try:
                self.out = self.run_rnn(self.fix_tokens(self.pipeline.encode(self.init_prompt)))
                gc.collect()
                torch.cuda.empty_cache()
                self.srv_list = ['dummy_server']
                for s in self.srv_list:
                    self.save_all_stat(s, 'chat', self.out,user_id,discussion_id)   
                pass
            except IOError:
                pass

        # Charger l'état du modèle à partir du fichier
        out = self.load_all_stat(srv, 'chat',user_id,discussion_id)
        msg = msg.strip().replace('\r\n','\n').replace('\n\n','\n')
        new = f"{self.user}{self.interface} {msg}\n\n{self.bot}{self.interface}"
        out = self.run_rnn(self.pipeline.encode(new), newline_adj=-999999999)

        begin = len(self.model_tokens)
        out_last = begin
        
        occurrence = {}
        generated_response=''
        for i in range(999):
            if i <= 0:
                newline_adj = -999999999
            elif i <= self.CHAT_LEN_SHORT:
                newline_adj = (i - self.CHAT_LEN_SHORT) / 10
            elif i <= self.CHAT_LEN_LONG:
                newline_adj = 0
            else:
                newline_adj = min(3, (i - self.CHAT_LEN_LONG) * 0.25) # DOIT TERMINER LA GÉNÉRATION

            for n in occurrence:
                out[n] -= (self.GEN_alpha_presence + occurrence[n] * self.GEN_alpha_frequency)
            token = self.pipeline.sample_logits(
                out,
                temperature=x_temp,
                top_p=x_top_p,
            )
            
            for xxx in occurrence:
                occurrence[xxx] *= self.GEN_penalty_decay 
                            
            if token not in occurrence:
                occurrence[token] = 1
            else:
                occurrence[token] += 1
                
            out = self.run_rnn([token], newline_adj=newline_adj)
            out[self.END_OF_TEXT] = -999999999  # désactiver 

            xxx = self.pipeline.decode(self.model_tokens[out_last:])
            if '\ufffd' not in xxx: # éviter les problèmes d'affichage en UTF-8
                generated_response=generated_response + xxx
                out_last = begin + i + 1
            
            send_msg = self.pipeline.decode(self.model_tokens[begin:])
            if '\n\n' in send_msg:
                send_msg = send_msg.strip()
                break
        
        # Sauvegarder l'état du modèle avec la nouvelle réponse générée
        self.save_all_stat(srv, 'chat', out,user_id,discussion_id)

        return generated_response

# Le code suivant initialise la classe `ChatRWKV` et fournit une interface pour l'interaction avec l'utilisateur.
# Il prend l'entrée de l'utilisateur, la traite et génère une réponse en utilisant le modèle.
# La fonction `response_generator.on_message()` génère la réponse à l'entrée de l'utilisateur.
# La boucle continue tant que l'utilisateur n'entre pas de message vide.
from rwkv.model import RWKV
from rwkv.utils import PIPELINE
response_generator = ChatRWKV()

print("Dites quelque chose : ")
while True:
    print("Utilisateur : ")
    msg = input()
    if len(msg.strip()) > 0:
        print("\n")
        print("Weprompt : ")
        print(response_generator.on_message(msg, '4', '7', 'ProjectAdvisor'))
        print("\n")
    else:
        print('Erreur : veuillez dire quelque chose')
