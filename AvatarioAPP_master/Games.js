import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';

const Games = ({ navigation }) => {
    return (
    <View style={styles.container}>
      {/* Header section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Bonjour Amine</Text>
             <Image source={require('./pictures/soleil.png')} style={styles.icon} />
      </View>
      <View style={styles.levels}>
        <Text style={
            styles.progress
        }>1/4</Text>
        <Text style={styles.lvl5}>Niveau 5</Text>

      </View>

      <View style={styles.botMessage}>
                <TouchableOpacity 
                      onPress={() => navigation.navigate('Chatbot')}
                      >       

      <Image 
      source={require('./pictures/bot.png')} style={styles.icon} />
      </TouchableOpacity>

      </View>

      {/* Menu Options */}
      <View style={styles.menu}>
      <TouchableOpacity style={[styles.menuItem, styles.menuItemFruits]}>
        <Image source={require('./pictures/fruits..png')} style={styles.icon} />
        <Text style={styles.imgTitle}>Fruits</Text>

        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.menuItemJeu]}>
        <Image source={require('./pictures/jeu.png')} style={styles.icon} />
        <Text style={styles.imgTitle}>Jeux</Text>

        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.menuItemAnimaux]}>
        <Image source={require('./pictures/animaux.png')} style={styles.icon} />
        <Text style={styles.imgTitle}>Animaux</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.menuItemDessin]}>
        <Image source={require('./pictures/dessin.png')} style={styles.icon} />
        <Text style={styles.imgTitle}>Dessin</Text>

        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection:'row'
  },
  headerText:{
    marginTop:20,
    fontSize:40,
    fontWeight:'900',
    color:'#073B4C'

  },
  levels: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Aligns children to the start of the main-axis.
    alignItems: 'center', // Aligns children vertically in the center.
    width: '100%',
    marginLeft:60, 
    marginBottom:10
  },
  progress:{
    backgroundColor:"#3793C9",
    color:"white",
    fontWeight:'900',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    fontSize:22,


  },
  lvl5:{
backgroundColor:"#EF476F",
color:"white",
fontWeight:'500',
fontSize:22,
paddingVertical: 12,
paddingHorizontal: 32,
borderRadius: 25,
marginLeft:10

  },
  imgTitle:{
    fontSize:20,
    fontWeight:'900',
    color:'#073B4C',
  },
  
  icon: {
    // styles for the sun icon
  },
  botMessage: {
    // styles for the bot message
  },
  menu: {
    flexDirection: 'row', // Arrange items in a row
    flexWrap: 'wrap', // Allow items to wrap to the next line
    justifyContent: 'space-around', // Distribute extra space around items
    alignItems: 'center', // Align items vertically in the center
    width: '100%', // Take the full width of the screen
  },
  menuItem: {
    width: '45%', // Take up less than half of the container's width to allow for wrapping
    aspectRatio: 1, // Keep the width and height the same for square items
    justifyContent: 'center', // Center content horizontally
    alignItems: 'center', // Center content vertically
    margin: '2%',
    padding: 1, // Add padding
    borderRadius: 20, // Round the corners
    margin: 10, // Add margin to separate the items
    alignItems: 'center', // Center the items
    justifyContent: 'center', // Center the items
  },
  menuItemFruits: {
    backgroundColor: '#A2FAA3', // Example color for the "Fruits" item
  },
  menuItemJeu: {
    backgroundColor: '#85E3FF', // Example color for the "Jeu" item
  },
  menuItemAnimaux: {
    backgroundColor: '#FFC785', // Example color for the "Animaux" item
  },
  menuItemDessin: {
    backgroundColor: '#F4A8FF', // Example color for the "Dessin" item
  },
});

export default Games;
