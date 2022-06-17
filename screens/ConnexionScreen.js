import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  StyleSheet,
  Switch,
} from "react-native";
import React from "react";
import { useState } from "react";
import checkStatus from "../utils/checkStatus";
import { useUserUpdate, useUser } from "../context/userContext";

const ConnexionScreen = ({ navigation }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [displayPassword, setDisplayPassword] = useState(true);
  const [addrIsEmail, setAddrIsEmail] = useState(true);
  const userUpdate = useUserUpdate();
  const [user, token] = useUser();
  const handleDisplayPassword = () => setDisplayPassword(!displayPassword);

  const getToken = (login, password) => {
    fetch("http://vm-26.iutrs.unistra.fr/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: login,
        password: password,
      }),
    })
      .then(checkStatus)
      .then(response => response.json())
      .then((data) => {
        userUpdate[1](data.token);
        whoAmI(data.token);
      })
      .catch((error) => {
        alert(error.message);
        console.log(error);
      });
  };

  const whoAmI = (token) => {
    fetch("http://vm-26.iutrs.unistra.fr/api/whoami", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
      .then(checkStatus)
      .then(response => response.json())
      .then((data) => {
        console.log(data);
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
        <TouchableOpacity onPress={handleDisplayPassword}>
          <Text>Afficher le mot de passe</Text>
        </TouchableOpacity>
      </View>

      
      <View >
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            addrIsEmail
              ? getToken(login, password)
              : alert("L'adresse e-mail n'est pas valide.");
          }}
        >
          <Text style={styles.buttonText}>Connexion</Text>
        </TouchableOpacity>
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
    margin: 10,
    width: '95%', 
    borderRadius: 4, 
    backgroundColor: '#14274e', 
    justifyContent: 'center', 
    alignSelf: 'center',
    height: 50,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold', 
    textAlign: 'center',
    fontSize: 15,
    margin: 5
  },
});
