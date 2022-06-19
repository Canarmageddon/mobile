import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, Text, TouchableOpacity } from "react-native";
import { StackActions } from "@react-navigation/native";
import { useTrip } from "../context/tripContext";
import { useUser } from "../context/userContext";
import { usePosition } from "../contexts/GeolocationContext";
import checkStatus from "../utils/checkStatus";
import { useMutation, useQueryClient } from "react-query";

function NewLogBookEntryScreen({ navigation, route }) {
  const sendEntry = ({ content, creator, trip, latitude, longitude }) =>
    fetch(`http://vm-26.iutrs.unistra.fr/api/log_book_entries`, {
      method: "POST",
      headers: {
        accept: "application/ld+json",
        "Content-Type": "application/ld+json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        content,
        creator,
        trip,
        latitude,
        longitude
      }),
    }).then(checkStatus).then((res) => res.json());

  const queryClient = useQueryClient();
  const trip = useTrip();
  const [currentPosition, setCurrentPosition] = usePosition();
  const [user, token] = useUser();
  const [textValue, setTextValue] = useState("");
  const mutation = useMutation(sendEntry, {
    onSuccess: (data) => {
      queryClient.setQueryData(`logBook${trip.id}`, (old) => [...old, data]);
      const popAction = StackActions.pop(1);
      navigation.dispatch(popAction);
    },
  });
  const handlePress = () => {
    mutation.mutate({
      content: textValue,
      creator: user.id,
      trip: trip.id,
      latitude: currentPosition.latitude, 
      longitude: currentPosition.longitude,
    });
  };

  return <>    
    <View style={styles.mainContainer}>
      <View style={styles.container}>
          <View style={styles.input}>
              <Text style={styles.inputTitles}>Texte</Text>
              <TextInput
                style={styles.textInput} 
                value={textValue}
                onChangeText={(text) => setTextValue(text)}
                multiline={true}
                placeholder='Ecrivez ici'
              />
          </View>
      </View>
      <View style={styles.footer}>
          <TouchableOpacity onPress={() => handlePress()} style={styles.button}>
              <Text style={styles.buttonText}>Enregistrer</Text>                
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
        height: '85%'
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
        height: '93%',
        fontSize: 20,
        textAlign: 'center',
        padding: 5
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

export default NewLogBookEntryScreen;
