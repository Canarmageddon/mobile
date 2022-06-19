import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useTrip } from "../context/tripContext";
import { useUser } from "../context/userContext";
import { useMutation, useQueryClient } from 'react-query';
import checkStatus from "../utils/checkStatus";
import { Picker } from '@react-native-picker/picker';
import MultiSelect from 'react-native-multiple-select';
import { ScrollView } from "react-native-gesture-handler";

function AddExpanseScreen({navigation, route}) {
    const [connectedUser, token] = useUser();
    const trip = useTrip();
    const queryClient = useQueryClient();
    const [category, setCategory] = useState('Alimentaire');
    const [label, setLabel] = useState(null);
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [costValue, setCostValue] = useState(0);
    const [formIsComplete, setFormIsComplete] = useState(false);

    // const addItem = useMutation(({creator, category, beneficiaries, trip, label, value}) => addExpanse(creator, category, beneficiaries, trip, label, value), {
    //     onSuccess: item => queryClient.setQueryData(
    //         ['tripExpanses', trip.id],
    //         items => [...items, item]
    //     )
    // });

    const addExpanse = (creator, category, beneficiaries, trip, label, value) => {
        return fetch(`http://vm-26.iutrs.unistra.fr/api/costs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({creator, category, trip, label, value})
        })
        .then(checkStatus)
        .then(response => response.json())
        .then(data => {
        //   console.log(data);
            beneficiaries.forEach(beneficiary => {
                addBeneficiariesToExpanse(beneficiary, data.id);
            });
            queryClient.invalidateQueries(['tripExpanses', trip]);
            navigation.goBack();
            return data;
        })  
        .catch(error => {
            console.log(error.message);
        });
    }
    
    const addBeneficiariesToExpanse = (beneficiary, expanseId) => {
        return fetch(`http://vm-26.iutrs.unistra.fr/api/costs/${expanseId}/addBeneficiary`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({email: beneficiary})
        })
        .then(checkStatus)
        .then(response => response.json())
        .then(data => {
            console.log(data);  
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
            <ScrollView style={styles.container}>
                <View style={styles.input}>
                    <Text style={styles.inputTitles}>Intitulé</Text>
                    <TextInput style={styles.textInput} value={label} onChangeText={setLabel}/>
                </View>
                <View style={styles.input}>
                    <Text style={styles.inputTitles}>Coût (en €)</Text>
                    <TextInput style={styles.textInput} keyboardType='number-pad' value={costValue.toString()} onChangeText={setCostValue}/>
                </View>
                <View style={styles.input}>
                    <Text style={styles.inputTitles}>Catégorie</Text>
                    <View style={styles.textInput}>
                        <Picker style={styles.textInput} selectedValue={category} onValueChange={itemValue => setCategory(itemValue)}>
                            <Picker.Item key="Alimentaire" label="Alimentaire" value="Alimentaire"/>
                            <Picker.Item key="Transport" label="Transport" value="Transport"/>
                            <Picker.Item key="Loisirs" label="Loisirs" value="Loisirs"/>
                            <Picker.Item key="Logement" label="Logement" value="Logement"/>
                            <Picker.Item key="Hygiène" label="Hygiène" value="Hygiène"/>
                            <Picker.Item key="Autre" label="Autre" value="Autre"/>
                        </Picker>
                    </View>
                </View>
                <View style={styles.input}>
                    <Text style={styles.inputTitles}>Bénéficiaires</Text>
                    <View style={styles.multiselector}>
                        <MultiSelect 
                            items={route.params.users.map(user => {
                                user = user.user;
                                return {id: user.id, name: `${user.firstName} ${user.lastName}`, value: `${user.email}`}
                            }).filter(user => user.id !== connectedUser.id)}
                            uniqueKey="value"
                            onSelectedItemsChange={(selectedItems) => setBeneficiaries(selectedItems)}
                            selectedItems={beneficiaries}
                            selectText="Sélectionner les bénéficiaires"
                            searchInputPlaceholderText="Chercher parmi les participants..."
                            tagRemoveIconColor="#000"
                            tagBorderColor="#000"
                            tagTextColor="#000"
                            itemTextColor="#000"
                            displayKey="name"
                            searchInputStyle={{ color: '#CCC' }}
                            submitButtonColor="#9AC4F8"
                            submitButtonText="Valider"
                            styleMainWrapper={{margin: 5}}
                        />
                    </View>
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => { formIsComplete   
                    // ? addItem.mutate({creator: connectedUser.id, category: category, beneficiaries: beneficiaries, trip: trip.id, label: label, value: parseFloat(costValue)})
                    ? addExpanse(connectedUser.id, category, beneficiaries, trip.id, label, parseFloat(costValue))
                    : alert('Tous les champs ne sont pas remplis.');
                }} style={styles.button}>
                    <Text style={styles.buttonText}>Ajouter</Text>                
                </TouchableOpacity>
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
        height: '85%',
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
    multiselector: {
        height: 'auto',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
    }
});

export default AddExpanseScreen;