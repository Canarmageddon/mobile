import {
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
  } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import checkStatus from "../utils/checkStatus";
import { useUser, useUserUpdate } from "../context/userContext";
import refreshToken from "../utils/refreshToken";
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
    const [user, token] = useUser();
    const userUpdate = useUserUpdate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(async () => {
        const refresh_token = await AsyncStorage.getItem('@refresh_token');
        if(refresh_token){
            refreshToken(userUpdate);
        }
    }, []);
    
    useEffect(() => {
        whoAmI();
    }, [token]);

    const whoAmI = () => {
        if(token != null && (user == null || user.length === 0)){
            fetch("http://vm-26.iutrs.unistra.fr/api/whoami", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })
            .then(checkStatus)
            .then(response => response.json())
            .then((data) => {
                userUpdate[0](data);
                setIsLoading(false);
            })
            .catch((error) => {
                if(error.message === "Expired JWT Token"){
                    refreshToken(userUpdate);
                }
                console.log(error);
            });
        }
        else{
            setIsLoading(false);
        }
    };

    async function deleteRefreshToken(){
        await AsyncStorage.removeItem('@refresh_token');
    }

    return <>
        <View style={styles.header}>
            <Text style={styles.title}>Duck-Trotter</Text>
        </View>
        {
            isLoading ? <Text style={{textAlign: 'center', fontSize: 20}}>Chargement...</Text>
            : <>
            <View style={styles.nav}>
                {
                    user != null && user.length !== 0 ? 
                    <View style={styles.connexionView}>
                        <Text style={styles.text}>Bienvenue {user.firstName} {user.lastName.substring(0,1).toUpperCase()}.</Text>
                        <TouchableOpacity style={[styles.button, {backgroundColor: '#dc3545'}]} onPress={() => { userUpdate[0](null); userUpdate[1](null); deleteRefreshToken(); } }>
                            <Text style={styles.buttonText}>Déconnexion</Text>
                        </TouchableOpacity>
                    </View> :   
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Connexion')}>
                        <Text style={styles.buttonText}>Connexion</Text>
                    </TouchableOpacity>
                }
            </View>
            {
                user != null && user.length !== 0 ? <>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Mes voyages')}>
                        <Text style={styles.buttonText}>Mes voyages</Text>
                    </TouchableOpacity>
                </> : null
            }
            </>
        }
    </>
};

export default HomeScreen;

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#9AC4F8',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 70,
        width: '100%',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        margin: 5,
        color: '#fff',
    },
    nav: {
        flexDirection: 'row',
        height: 50,
        margin: 5,
        justifyContent: 'flex-end',
    },
    button: {
        margin: 5,
        width: 100, 
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
    text: {
        color: '#000',
        fontSize: 15,
        margin: 5
    },
    connexionView: {
        alignItems: 'center',
        flexDirection: 'row'
    }
});