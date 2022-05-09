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
// import { useTrip } from "../context/tripContext";
// import { useQuery, useQueryClient } from 'react-query';;

function LogbookScreen({ navigation, route }) {
  // const [trip] = useTrip();
  // const { isLoading, isError, error, data: photos } = useQuery('trip' + trip.id + '_photos', () => getPhotos());

  // const getPhotos = () => {
  //     return fetch('http://vm-26.iutrs.unistra.fr/api/trips/' + trip.id + '/photos')
  //       .then(checkStatus)
  //       .then(response => response.json())
  //       .then(data => {
  //           return data;
  //       })
  //       .catch(error => {
  //           console.log(error.message);
  //       });
  // }

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
    <View>
      {/* {isLoading ? <Text style={styles.text}>Loading...</Text> : 
                <FlatList
                    data={listeTrip}
                    renderItem={TripListItem}
                    keyExtractor={item => item.id}
                />
            } */}
      <Button
        title='Ajouter une entrée au journal'
        onPress={() => navigation.navigate("Nouvelle entrée au journal")}
      />
    </View>
  );
}

const styles = StyleSheet.create({});

export default LogbookScreen;
