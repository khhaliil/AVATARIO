import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

const FirstPage = ({ navigation }) => {
    return (
        <View style={styles.container}>
      <View style={styles.header}>
        {/* Add more header content if necessary */}
      </View>
      <View style={styles.mainContent}>
        <Image source={require('./pictures/parent.png')} style={styles.mainImage} />
        <Image source={require('./pictures/textImageTitrePremierePage.png')} style={styles.textImage} />
        <Text style={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
  <TouchableOpacity style={styles.buttonContinuer}         
  onPress={() => navigation.navigate('WelcomePage')}>
    <Text style={styles.buttonText}>Continuer</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.buttonLanguage}>
    <Text style={styles.buttonLanguagetext}>Fr</Text>
  </TouchableOpacity>
</View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Fr</Text>
        {/* Add more footer content if necessary */}
      </View>
    </View>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFDD0', // Replace with the actual background color
    },
    buttonContainer: {
        flexDirection: 'row', // Align children in a row
        justifyContent: 'space-around', // Distribute children evenly with space around them
        alignItems: 'center', // Center children vertically
        marginTop: 20, // Add some margin at the top
      },
    header: {
    },
    icon: {
      // Style for the sun and bees icons
    },
    mainContent: {
      flex: 1,
      alignItems: 'center', // Center items horizontally
      justifyContent: 'center', // Center items vertically
      paddingHorizontal: 16, // Add some horizontal padding
    },
    mainImage: {
        marginTop:10,
      height:250,
      width:250,
      marginBottom: 14, // Add some margin at the bottom
    },
    textImage: {
        marginBottom: 14, // Add some margin at the bottom
    },
    description: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#073B4C', // Replace with actual color
      textAlign: 'left',
      marginBottom: 24, // Add some margin at the bottom
    },
    buttonContinuer: {
      backgroundColor: '#007bff', // Replace with actual button color
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 25,
      alignSelf: 'center', // Position the button at the center
      marginBottom: 24, // Add some margin at the bottom
    },
    buttonText: {
      color: 'white', // Replace with actual button text color
      fontSize: 18,
      fontWeight: 'bold',
    },

    buttonLanguage :{
        backgroundColor: 'white', // Replace with actual button color
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderColor:"#007bff",
        borderRadius: 25,
        alignSelf: 'center', // Position the button at the center
        marginBottom: 24, // Add some margin at the bottom
    },
    buttonLanguagetext:{
        color: '#007bff', // Replace with actual button text color
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: 'white',
    },
    footer: {
      // Add styles for footer
    },
    footerText: {
      // Style for the footer text
    },
  });
    
export default FirstPage
