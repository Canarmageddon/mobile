import {
  Text,
  Pressable,
  View,
  TextInput,
  Button,
  StyleSheet,
  Switch,
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import checkStatus from "../utils/checkStatus";
import { useUserUpdate } from "../context/userContext";

const ConnexionScreen = ({ navigation }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [displayPassword, setDisplayPassword] = useState(true);
  const [addrIsEmail, setAddrIsEmail] = useState(true);
  const userUpdate = useUserUpdate();

  const handleDisplayPassword = () => setDisplayPassword(!displayPassword);

  const connect = (login, password) => {
    // navigation.navigate('Mes voyages');
    // fetch('http://vm-26.iutrs.unistra.fr/api/users/signin', {
    fetch("http://vm-26.iutrs.unistra.fr/api/users/checkCredentials", {
      method: "POST",
      headers: {
        accept: "application/ld+json",
        "Content-Type": "application/ld+json",
      },
      body: JSON.stringify({
        email: login,
        password: password,
      }),
    })
      .then(checkStatus)
      .then((response) => response.json())
      .then((data) => {
        userUpdate[0](data);
        navigation.navigate("Mes voyages");
      })
      .catch((error) => {
        alert(error.message);
        console.log(error);
      });
  };

  return (
    <>
      <View style={styles.input}>
          <Text style={styles.inputTitles}>Identifiant : </Text>
          <TextInput 
            value={login}
            style={styles.textInput}
            placeholder='adresse e-mail'
            onChangeText={setLogin}
          />
      </View>
      <View style={styles.input}>
          <Text style={styles.inputTitles}>Mot de passe : </Text>
          <TextInput 
            style={styles.textInput} 
            value={password}
            onChangeText={setPassword}
            secureTextEntry={displayPassword}
            placeholder='mot de passe'
          />
      </View>

      <View style={styles.container}>
        <Switch value={displayPassword} onValueChange={setDisplayPassword} />
        <Pressable onPress={handleDisplayPassword}>
          <Text>Afficher le mot de passe</Text>
        </Pressable>
      </View>

      
      <View >
        <Pressable
          style={styles.button}
          onPress={() => {
            addrIsEmail
              ? connect(login, password)
              : alert("L'adresse e-mail n'est pas valide.");
          }}
        >
          <Text style={styles.buttonText}>Connexion</Text>
        </Pressable>
      </View>
    </>
  );
};

export default ConnexionScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  inputTitles: {
    fontSize: 23,
    marginBottom: 5
  },
  input: {
    flexDirection: 'column',
    margin : 10,
  },
  textInput: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    height: 55,
    fontSize: 20,
    textAlign: 'center'
  },
  button: {
    height: 50,
    backgroundColor: "#1589FF",
    margin: 10,
    borderColor: "black",
    borderRadius: 5,
    borderWidth: 1,
    display: "flex",
    justifyContent: "center",
  },
  buttonText: {
    margin: 5,
    textAlign: "center",
    fontWeight: "bold",
    color: 'white',
    fontSize: 15
  },
});
