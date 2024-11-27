import React, { useState, useEffect } from 'react';
import { Text, Button, TextInput, FlatList, View, StyleSheet, ImageBackground } from 'react-native';
import { getFirestore, doc, updateDoc,setDoc, collection, getDocs } from 'firebase/firestore';

const db = getFirestore();

const Game = ({ user }) => {
  const [numbers, setNumbers] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [correctSum, setCorrectSum] = useState(0);
  const [resultMessage, setResultMessage] = useState('');
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  // Pokretanje igre
  const startGame = () => {
    setIsStarted(true);
    setNumbers([]);
    setShowInput(false);
    setResultMessage('');
    let index = 0;
    let sum = 0;

    const interval = setInterval(() => {
      if (index < 10) {
        const randomNum = Math.floor(Math.random() * 10) + 1;
        setNumbers((prevNumbers) => [...prevNumbers, randomNum]);
        sum += randomNum;
        index++;
      } else {
        clearInterval(interval);
        setCorrectSum(sum);
        setTimeout(() => {
          setShowInput(true);
        }, 800);
      }
    }, 800);
  };

  // Provjera odgovora
  const checkResult = async () => {
    const userResult = parseInt(userInput);
    let newScore = score;

    if (userResult === correctSum) {
      setResultMessage(`Čestitamo! Točan rezultat! Zbroj je: ${correctSum}.`);
      newScore += 5;
    } else {
      setResultMessage(`Pogrešno! Točan rezultat je bio ${correctSum}, a vaš unos je bio ${userResult}.`);
      newScore -= 7;
    }

    setScore(newScore);
    await saveScore(newScore);
    setShowInput(false);
    setIsStarted(false);
  };

  // Spremanje bodova
  const saveScore = async (newScore) => {
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { score: newScore });
    fetchLeaderboard();
  };

  // Dohvaćanje leaderboarda
  const fetchLeaderboard = async () => {
    const leaderboardRef = collection(db, 'users');
    const snapshot = await getDocs(leaderboardRef);
    const leaderboardData = snapshot.docs.map((doc) => doc.data());
    leaderboardData.sort((a, b) => b.score - a.score);
    setLeaderboard(leaderboardData);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [score]);

  return (
    <ImageBackground 
      source={require('../assets/background.png')}  
      style={styles.background}
    >
      <View style={styles.gameContainer}>
        {leaderboard.length > 0 && (
          <>
            {/* Prikaz najboljeg igrača */}
            <Text style={styles.bestPlayerText}>
              Najbolji igrač: {leaderboard[0].name || leaderboard[0].email || 'Nepoznat korisnik'} 
              ({leaderboard[0].score} bodova)
            </Text>

            {/* Lista ostalih igrača */}
            <FlatList
              data={leaderboard.slice(1)} // Izuzmi prvog korisnika
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Text style={styles.leaderboardText}>
                  {item.name || item.email || 'Nepoznat korisnik'}: {item.score} bodova
                </Text>
              )}
            />
          </>
        )}

        {!isStarted && !showInput && resultMessage === '' && (
          <Button title="Pokreni igru" onPress={startGame} />
        )}

        {isStarted && numbers.length > 0 && (
          <Text style={styles.number}>{numbers[numbers.length - 1]}</Text>
        )}

        {showInput && (
          <View style={styles.inputContainer}>
            <Text style={styles.prompt}>Unesite zbroj brojeva:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Unesite rezultat"
              value={userInput}
              onChangeText={(text) => setUserInput(text)}
            />
            <Button title="Provjeri" onPress={checkResult} />
          </View>
        )}

        {resultMessage !== '' && (
          <Text style={styles.resultMessage}>{resultMessage}</Text>
        )}

        {resultMessage !== '' && (
          <Button title="Započni ponovo" onPress={startGame} />
        )}

        <Text style={styles.score}>Vaši bodovi: {score}</Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  gameContainer: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaderboardText: {
    fontSize: 18,
    color: 'black',
  },
  bestPlayerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gold',
    marginBottom: 10,
    marginTop:50,
    textAlign: 'center',
  },
  number: {
    fontSize: 100,
    fontWeight: 'bold',
    color: 'red',
  },
  inputContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  prompt: {
    fontSize: 30,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '80%',
    marginVertical: 20,
    borderRadius: 5,
    textAlign: 'center',
  },
  resultMessage: {
    fontSize: 30,
    marginTop: 20,
    textAlign: 'center',
    color: 'green',
    fontWeight: 'bold',
  },
  score: {
    fontSize: 24,
    marginTop: 20,
    fontWeight: 'bold',
  },
});

export default Game;
