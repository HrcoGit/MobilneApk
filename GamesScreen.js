import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { AuthContext } from '../AuthContext';
import Game from './IgraP';  

export default function GameScreen() {
  const { user } = useContext(AuthContext); 

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dobrodošli u sekciju Igrice!</Text>
      {user ? (
        <Game user={user} />  
      ) : (
        <Text style={styles.text}>Molimo vas da se prijavite kako biste igrali.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    textAlign: 'center',
  },
});
