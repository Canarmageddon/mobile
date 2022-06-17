import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import React from "react";
import checkStatus from "../utils/checkStatus";
import { useQuery, useQueryClient } from "react-query";
import { useTripUpdate } from "../context/tripContext";
import { useUser } from "../context/userContext";

const TripListScreen = ({ navigation }) => {
  const [user] = useUser();
  const tripUpdate = useTripUpdate();
  const queryClient = useQueryClient();

  const { isLoading, isError, error, data: listeTrip } = useQuery(['listeTrip', user.id], () => getUserTrips(user.id));

  const getUserTrips = (userId) => {
    return fetch(`http://vm-26.iutrs.unistra.fr/api/users/${userId}/trips`)
      .then(checkStatus)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data['hydra:member']);
        queryClient.setQueryData(['listeTrip', userId], listeTrip);
        return data;
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  let TripListItem = ({ item: trip }) => {
    return (
      <TouchableOpacity
          onPress={() => {
            tripUpdate(trip);
            navigation.navigate("MapScreen");
        }}>
        <View style={styles.tripButton}>
          <Text style={styles.buttonText}>{trip.name}</Text>  
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      {
        isLoading ? 
        <Text style={styles.text}>Loading...</Text> : 
        <FlatList
          data={listeTrip}
          renderItem={TripListItem}
          keyExtractor={(item) => item.id}
        />
      }
    </View>
  );
};

export default TripListScreen;

const styles = StyleSheet.create({
  tripButton: {
    height: 60,
    margin: 5,
    borderRadius: 1,
    backgroundColor: "#9AC4F8",
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: "#2c75ff",
    borderRadius: 5,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 4,
    borderBottomWidth: 4,
  },
  buttonText: {
    color: '#fefefe',
    margin: 5,
    fontSize: 18,
    fontWeight: 'bold'
  },
  text: {
    fontSize: 15,
    margin: 5,
  },
});
