import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../firebaseConfig";
import { AuthContext } from "../AuthContext";

import LoginInput from "./ui/LoginInput";
import LoginButton from "./ui/LoginButton";

export default function LoggedInView() {
  const { logout } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    bio: ''
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      // Provjera korisnika prije dohvaćanja podataka
      if (!auth.currentUser) {
        Alert.alert("Greška", "Korisnik nije prijavljen.");
        setLoading(false);
        return;
      }

      try {
        const userId = auth.currentUser.uid;
        const docRef = doc(firestore, "users", userId);

        // Provjeri lokalni keširanje prije dohvaćanja s interneta
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching profile: ", error);
        Alert.alert("Greška", "Došlo je do greške pri učitavanju vašeg profila.");
      } finally {
        setLoading(false); // Ovdje postavljamo loading na false
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!profile.name || !profile.age || !profile.bio) {
      Alert.alert("Greška", "Svi podaci su obavezni.");
      return;
    }

    try {
      setIsSaving(true);
      const userId = auth.currentUser.uid;
      await setDoc(doc(firestore, "users", userId), profile, { merge: true });
      Alert.alert("Profil spremljen", "Vaš profil je uspješno spremljen!");
    } catch (error) {
      console.error("Greška pri spremanju profila: ", error);
      Alert.alert("Greška", "Došlo je do greške pri spremanju vašeg profila.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Učitavanje profila...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Dobrodošli na sustav</Text>

      <LoginButton title="Odjavi se" onPress={logout} />

      <LoginInput 
        placeholder="Unesite svoje ime"
        value={profile.name}
        onChangeText={(text) => setProfile((prevState) => ({ ...prevState, name: text }))}
      />

      <LoginInput 
        placeholder="Unesite svoje godine"
        value={profile.age}
        onChangeText={(text) => setProfile((prevState) => ({ ...prevState, age: text }))}
        keyboardType="numeric"
      />

      <LoginInput 
        placeholder="O meni ..."
        value={profile.bio}
        onChangeText={(text) => setProfile((prevState) => ({ ...prevState, bio: text }))}
        multiline
      />

      <LoginButton 
        title={isSaving ? "Spremanje..." : "Spremi profil"} 
        onPress={handleSaveProfile} 
        disabled={isSaving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});
