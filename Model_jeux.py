import json
import random
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Function to generate random data for a session
def generate_session_data():
    response_time = random.uniform(1, 15)  # Simulated response time in seconds
    accuracy = random.uniform(30, 100)     # Simulated accuracy percentage
    attention_span = random.uniform(1, 30)  # Simulated attention span in minutes

    return {
        'Response Time': response_time,
        'Accuracy': accuracy,
        'Attention Span': attention_span
    }

# Number of JSON files to generate
num_files = 10  # You can change this number as needed

# Generate and save JSON files
for i in range(num_files):
    data = generate_session_data()
    filename = f'data_{i + 1}.json'
    with open(filename, 'w') as json_file:
        json.dump(data, json_file)

# Load and preprocess the data
data_list = []
labels = []

for i in range(num_files):
    filename = f'data_{i + 1}.json'
    with open(filename, 'r') as json_file:
        data = json.load(json_file)
        data_list.append(data)

        # Manually label the data based on criteria (for demonstration)
        if data['Response Time'] > 10 or data['Accuracy'] < 70 or data['Attention Span'] < 5:
            labels.append('Medical Support Needed')
        else:
            labels.append('Typical Development')

# Create a DataFrame from the data
df = pd.DataFrame(data_list)

# Convert labels to numerical values (0 for 'Typical Development', 1 for 'Medical Support Needed')
df['Label'] = [0 if label == 'Typical Development' else 1 for label in labels]

# Split the data into features (X) and labels (y)
X = df.drop('Label', axis=1)
y = df['Label']

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Build and train the model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)

# Evaluate the model
accuracy = accuracy_score(y_test, predictions)
print("Accuracy:", accuracy)