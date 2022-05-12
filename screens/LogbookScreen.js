import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Pressable,
  Button,
  TextInput,
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
    return fetch(`http://vm-26.iutrs.unistra.fr/api/trips/1/logBookEntries`)
      .then(checkStatus)
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  };
  let TripListItem = ({ item: trip }) => {
    return (
      <>
        <View style={styles.tripButton}>
          <Button
            onPress={() => {
              // tripUpdate(trip);
              navigation.navigate("Mes voyages");
            }}
            title={trip.name}
            color={"#00A5C7"}
          ></Button>
        </View>
      </>
    );
  };
  return (
    <View style={styles.content}>
      <ScrollView>
        {!isError &&
          !isLoading &&
          data != undefined &&
          data.map((text) => <Text>{text.content}</Text>)}
      </ScrollView>

      <View style={styles.content}></View>
      <Button
        title='Ajouter une entrée au journal'
        onPress={() => navigation.navigate("Nouvelle entrée au journal")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});

export default LogbookScreen;
