import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import checkStatus from "../utils/checkStatus";
import { useTrip } from "../context/tripContext";
import { useQuery } from "react-query";
import { ScrollView } from "react-native-gesture-handler";

function LogbookScreen({ navigation, route }) {
  const trip = useTrip();
  const { isLoading, isError, error, data } = useQuery(
    `logBook${trip.id}`,
    () => getLogBookEntries(trip.id),
    { refetchOnWindowFocus: "always" },
  );
  const getLogBookEntries = (tripId) => {
    return fetch(`http://vm-26.iutrs.unistra.fr/api/trips/${trip.id}/logBookEntries`)
      .then(checkStatus)
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  };

  return (
    <View style={styles.content}>
      <ScrollView style={styles.entriesContainer}>
        {!isError &&
          !isLoading &&
          data != undefined &&
          data.map((text, index) => (
            <>
              <View key={index} style={styles.entrie}>
                <Text style={styles.entriesText}>{new Date(text.creationDate).toLocaleDateString('fr-FR') + ' ' + new Date(text.creationDate).toLocaleTimeString()}</Text>
                <Text style={styles.entriesText}>{text.content}</Text>
              </View>
            </>
          ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Ajouter une entrée au journal")}
        >
          <Text style={styles.buttonText}>Ajouter une entrée au journal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#fff', 
    justifyContent: 'space-between', 
    alignItems: 'center',
  },
  entriesContainer: {
    display: 'flex',
    margin: 5,
    width: '100%'
  },
  entrie: {
    minHeight: 70,
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: 5,
    borderRadius: 1,
    backgroundColor: '#9AC4F8',
    padding: 10,
    borderColor: '#000',
    borderRadius: 5,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 4,
    borderBottomWidth: 4,
  },
  entriesText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15
  },
  buttonContainer: {
    width: '100%',
    height: '15%',
    backgroundColor: '#9AC4F8',
    alignItems: 'center', 
    justifyContent: 'center'
  },
  button: {
    borderRadius: 4, 
    backgroundColor: '#14274e', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: 40,
    paddingHorizontal: 5
  },
  buttonText: {
    margin: 5,
    textAlign: "center",
    fontWeight: "bold",
    color: 'white',
    fontSize: 15
  },
});

export default LogbookScreen;
