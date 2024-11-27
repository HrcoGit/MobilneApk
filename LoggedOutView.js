import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import LoginInput from "./ui/LoginInput";
import LoginButton from "./ui/LoginButton";
import ErrorMessage from "./ui/ErrorMessage";
import { AuthContext } from "../AuthContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function LoggedOutView() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [passw, setPassw] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Čišćenje greške prilikom novog pokušaja prijave
  useEffect(() => {
    setErrorMsg("");
  }, [email, passw]);

  const handleLogin = () => {
    if (!email || !passw) {
      setErrorMsg("Email i lozinka su obavezni.");
      return;
    }

    signInWithEmailAndPassword(auth, email, passw)
      .then(() => {
        login();
      })
      .catch((error) => setErrorMsg(error.message));
  };

  return (
    <View style={styles.container}>
      <LoginInput
        placeholder="Unesite Vašu email adresu"
        value={email}
        secureTextEntry={false}
        onChangeText={setEmail}
      />

      <LoginInput
        placeholder="Unesite vašu lozinku"
        secureTextEntry={true}
        value={passw}
        onChangeText={setPassw}
      />

      {errorMsg && <ErrorMessage error={errorMsg} />}

      <LoginButton title="Prijava" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});