import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';

const Chatbot = ({ navigation }) => {
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([]); // Stores both sent and received messages

    const sendMessage = async () => {
        const sentMessage = inputText;
        setMessages([...messages, { type: 'sent', text: sentMessage }]);

        // Send the message to your API and receive the response
        const response = await fetch('YOUR_API_ENDPOINT', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: sentMessage }),
        });
        const data = await response.json();

        // Append the received message to the messages array
        setMessages([...messages, { type: 'sent', text: sentMessage }, { type: 'received', text: data.reply }]);
        setInputText(''); // Clear the input field
    };
    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.logo}>Logo</Text>
                <Image style={styles.profilePic} source={require('./pictures/iconParent.png')} />
            </View>

            {/* Chatbot introductory text */}
            <Text style={styles.introText}>
                Notre chatbot IA vous aide à identifier certaines lacunes auxquelles votre enfant est confronté
            </Text>
<View style={styles.banner}>            
<Image style={styles.bannerPic} source={require('./pictures/icon1.png')} />
<View style={styles.bannerTexts}>
              
               
                <Text style={styles.userName}>Amine</Text>
                <View style={styles.userInfo}>
                <Text style={styles.userAge}>5 Ans</Text>
                <Text style={styles.userTrait}>Timide</Text>
                <Text style={styles.userTrait2}>Hyperactif</Text>
            </View>
            </View>
            </View>


            <ScrollView style={styles.messagesContainer}>
                <View style={styles.message}>
                    <Text style={styles.messageText}>Un text ici</Text>
                    <View style={styles.suggestions}>
                        <TouchableOpacity style={styles.suggestionButton}>
                            <Text>Suggestion 1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.suggestionButton}>
                            <Text>Suggestion 2</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            
            <ScrollView>
                {messages.map((message, index) => (
                    <Text key={index} style={message.type === 'sent' ? styles.sentMessages : styles.receivedMessages}>
                        {message.type === 'sent' ? 'Sent: ' : 'Received: '}{message.text}
                    </Text>
                ))}
            </ScrollView>

            <View style={styles.inputContainer}>
            <TextInput
                style={styles.inputField}
                placeholder="Écrire un message"
                value={inputText}
                onChangeText={setInputText}
            />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Image source={require('./pictures/send.png')} style={styles.sendIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5', // or any desired background color
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    logo: {
        // Style for logo text
    },
    profilePic: {
        // Style for profile picture
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    introText: {
        fontWeight:'900',
        color:'#073B4C',   
        padding: 7,
    },
    banner:{
        flexDirection:"row",
        backgroundColor: '#D3E7F2', // Example background color
        borderRadius: 10,
        padding: 10,
        margin: 10,

    },
    bannerTexts:{
         flexDirection:"column"
    },
    bannerPic:{

        height:60,
        width:60
    },
    userInfo: {
       
        flexDirection:'row'
        // Add other styling as needed
    },
    userName: {
        fontSize:20,
        fontWeight:'900',
        color:'#073B4C',    
        marginTop:5,
        marginLeft:10
    },

    userAge: {
backgroundColor:"#3793C9",
color:"white"
,        fontWeight:'900',
borderRadius:20,
padding:10,
marginRight:10,
marginLeft:10

    },

    userTrait: {
        backgroundColor:"#FFB000",
        fontWeight:'900',
        color:"white",
        borderRadius:20,
padding:10,
marginRight:10,


            },
            userTrait2: {
                backgroundColor:"#EF476F",
                fontWeight:'900',
                color:"white",
                borderRadius:20,
padding:10,
marginRight:10,

                    },
    messagesContainer: {
        flex: 1,
        // Add other styling as needed
    },
    message: {
        // Style for message bubble
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 10,
        margin: 10,
        // Add other styling as needed
    },
    messageText: {
        // Style for text inside message bubble
    },
    sentMessages:{
        color:"white",
        backgroundColor:"#3793C9",
        alignSelf:"flex-end",
        padding:10,
        margin:20,
        borderRadius:15,
        fontSize:24,
        

    },
    receivedMessages:{
        color:"black",
        backgroundColor:"#D3E7F0",
        alignSelf:"flex-start",
        padding:10,
        margin:20,
        borderRadius:15,
        fontSize:24,
        

    },
    suggestions: {
        // Style for suggestions container
        flexDirection: 'row',
        justifyContent: 'space-between',
        // Add other styling as needed
    },
    suggestionButton: {
        // Style for suggestion buttons
        backgroundColor: '#dddddd',
        borderRadius: 15,
        padding: 5,
        margin: 5,
        // Add other styling as needed
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        // Add other styling as needed
    },
    inputField: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 10,
        marginRight: 5,
        // Add other styling as needed
    },
    sendIcon:{
        width:24,
      height:24
    
    }
});
export default Chatbot;