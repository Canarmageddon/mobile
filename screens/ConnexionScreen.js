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
import checkStatus from "../utils/checkStatus"
// import { useUserUpdate } from "../context/userContext";
  
  const ConnexionScreen = ({navigation}) => {
    // const validator = require('validator');
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [displayPassword, setDisplayPassword] = useState(true);
    const [addrIsEmail, setAddrIsEmail] = useState(true);
    // const userUpdate = useUserUpdate();
  
    // useEffect(() => {    
    //   if(validator.isEmail(login)){
    //       setAddrIsEmail(true);
    //   }
    //   else{
    //       setAddrIsEmail(false);
    //   }
    // }, [login]);
  
    const handleDisplayPassword = () => setDisplayPassword(!displayPassword);
  
    const connect = (login, password) => {
        navigation.navigate('Mes voyages');
    //   fetch('http://sterne.iutrs.unistra.fr:8080/api/users/signin', {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({username: login, password})
    //   })
    //     .then(checkStatus)
    //     .then(response => response.json())
    //     .then(data => {
    //       userUpdate[0](data);
    //       userUpdate[1](data.token);
    //       navigation.navigate('Connecté');
    //     })        
    //     .catch(error => {
    //       alert(error.message);
    //       console.log(error);
    //     });
    }
  
    return <>
        <View style={styles.container}>
            <Text>Identifiant : </Text>
            <TextInput value={login} style={styles.input} placeholder="adresse e-mail" onChangeText={setLogin}/>
        </View>

        <View style={styles.container}>
            <Text>Mot de passe : </Text>
            <TextInput value={password} onChangeText={setPassword} secureTextEntry={displayPassword} style={styles.input} placeholder="mot de passe"/>
        </View>

        <View style={styles.container}>
            <Switch value={displayPassword} onValueChange={setDisplayPassword} />
            <Pressable onPress={handleDisplayPassword}>
                <Text>Afficher le mot de passe</Text>
            </Pressable>
        </View>

        <View style={styles.button}>
            <Button title="Connexion" onPress={() => { addrIsEmail ? connect(login, password) : alert("L'adresse e-mail n'est pas valide.")}}/>
        </View>
    </>;
  };
  
export default ConnexionScreen;

const styles = StyleSheet.create({
container: {
    flexDirection: "row",
    alignItems: 'center',
    marginLeft: 8,
},
input: {
    borderWidth: 1,
    width: 150,
    paddingBottom: 0,
    margin: 3,
    padding: 3
},
clickableText: {
    color: 'blue',
    textDecorationLine: 'underline',
    alignSelf: 'center',
    marginTop: 5,
    fontSize: 15
},
button: {
    margin: 8,
    borderWidth: 1, 
    borderRadius: 3,
},
title: {
    fontSize: 24,
    alignSelf: 'center',
    marginBottom: 5
}
});
  