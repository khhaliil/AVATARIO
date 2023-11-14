import React from 'react';
import { StyleSheet } from 'react-native';
import FirstPage from './FirstPage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomePage from './WelcomePage';
import Games from './Games';
import Chatbot from './Chatbot';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FirstPage">
        <Stack.Screen name="FirstPage" component={FirstPage} />
        <Stack.Screen name="WelcomePage" component={WelcomePage} />
        <Stack.Screen name="Games" component={Games} />
        <Stack.Screen name="Chatbot" component={Chatbot} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red', // This style is no longer needed as NavigationContainer wraps everything
  },
});

export default App;
