import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Pressable, FlatList, Image, Modal, Alert, TextInput } from 'react-native';
import { useTrip } from "../context/tripContext";
import { useUser } from "../context/userContext";
import { useQuery, useMutation, useQueryClient } from 'react-query';
import checkStatus from "../utils/checkStatus";
import {Picker} from '@react-native-picker/picker';

function AddExpanseScreen({navigation, route}) {
    const [user, token] = useUser();
    const trip = useTrip();
    const queryClient = useQueryClient();
    const [category, setCategory] = useState('Alimentaire');
    const [label, setLabel] = useState(null);
    const [beneficiaries, setBeneficiaries] = useState('Tous');
    const [costValue, setCostValue] = useState(0);
    const [formIsComplete, setFormIsComplete] = useState(false);

    const addItem = useMutation(({creator, category, beneficiaries, trip, label, value}) => addExpanse(creator, category, beneficiaries, trip, label, value), {
        onSuccess: item => queryClient.setQueryData(
            ['tripExpanses', trip.id],
            items => [...items, item]
        )
    });

    const addExpanse = (creator, category, beneficiaries, trip, label, value) => {
        return fetch(`http://vm-26.iutrs.unistra.fr/api/costs/new`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({creator, category, beneficiaries, trip, label, value})
        })
          .then(checkStatus)
          .then(response => response.json())
          .then(data => {
              console.log(data);
              navigation.goBack();
              return data;
          })  
          .catch(error => {
              console.log(error.message);
          });
    }

    useEffect(() => {
        if(label !== '' && label != null && costValue != 0 && costValue !== ''){
            setFormIsComplete(true);
        }
        else{
            setFormIsComplete(false);
        }
    }, [label, costValue]);

    return <>
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                <View style={styles.input}>
                    <Text style={styles.inputTitles}>Intitulé</Text>
                    <TextInput style={styles.textInput} value={label} onChangeText={setLabel}/>
                </View>
                <View style={styles.input}>
                    <Text style={styles.inputTitles}>Coût (en €)</Text>
                    <TextInput style={styles.textInput} keyboardType='number-pad' value={costValue} onChangeText={setCostValue}/>
                </View>
                <View style={styles.input}>
                    <Text style={styles.inputTitles}>Catégorie</Text>
                    <View style={styles.textInput}>
                        <Picker style={styles.textInput} selectedValue={category} onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}>
                            <Picker.Item label="Alimentaire" value="Alimentaire" />
                            <Picker.Item label="Transport" value="Transport" />
                            <Picker.Item label="Loisirs" value="Loisirs" />
                            <Picker.Item label="Logement" value="Logement" />
                            <Picker.Item label="Hygiène" value="Hygiène" />
                            <Picker.Item label="Autre" value="Autre" />
                        </Picker>
                    </View>
                </View>
                <View style={styles.input}>
                    <Text style={styles.inputTitles}>Bénéficiaires</Text>
                    <View style={styles.textInput}>
                        <Picker selectedValue={beneficiaries} onValueChange={(itemValue, itemIndex) => setBeneficiaries(itemValue)}>
                            <Picker.Item label="Tous" value="Tous" />
                            {
                                route.params.users.map(user => {
                                    return <Picker.Item key={user.id} label={`${user.firstName} ${user.lastName}`} value={`${user.firstName} ${user.lastName}`} />
                                })
                            }
                        </Picker>
                        </View>
                    </View>
            </View>
            <View style={styles.footer}>
                <Pressable onPress={() => { formIsComplete   
                    ? addItem.mutate({creator: user.id, category: category, beneficiaries: beneficiaries, trip: trip.id, label: label, value: parseFloat(costValue)})
                    : alert('Tous les champs ne sont pas remplis.');
                }} style={styles.button}>
                    <Text style={styles.buttonText}>Ajouter</Text>                
                </Pressable>
            </View>
        </View>
    </>;
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, 
        backgroundColor: '#fff', 
        justifyContent: 'space-between', 
        alignItems: 'center',
    },
    container: {
        width: '100%',
        height: '85%'
    },
    menu: {
        width: '100%',
        height: '15%',
        alignItems: 'center',
        marginBottom: 5,
        flexDirection: 'row',
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
        height: 60,
        fontSize: 20,
        textAlign: 'center'
    },
    button: {
        width: 130, 
        borderRadius: 4, 
        backgroundColor: '#14274e', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 40,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold', 
        textAlign: 'center'
    },
    footer: {
        width: '100%',
        height: '15%',
        backgroundColor: '#9AC4F8',
        alignItems: 'center', 
        justifyContent: 'center',
        borderTopColor: 'black',
        borderTopWidth: 2
    },
});

export default AddExpanseScreen;