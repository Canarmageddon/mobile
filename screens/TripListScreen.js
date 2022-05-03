import {
    View,
    Text, 
    StyleSheet,
    Button,
    FlatList
} from "react-native";
import React from "react";
import checkStatus from "../utils/checkStatus";
// import { useUser } from "../context/userContext";
// import { useQuery, useQueryClient } from 'react-query';
// import { useTripUpdate } from "../context/tripContext";

const TripListScreen = ({navigation, route}) => {
    // const [user] = useUser();
    // const tripUpdate = useTripUpdate();
    // const queryClient = useQueryClient();

    // const { isLoading, isError, error, data: listeTrip } = useQuery(['listeTrip', user.id], () => getUserTrips(user.id));

    const getUserTrips = userId => {
        // return fetch('http://vm-26.iutrs.unistra.fr/api/' + userId +'/trip')
        //     .then(checkStatus)
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log(data);
        //         queryClient.setQueryData(['listeTrip', user.id], listeTrip);
        //         return data;
        //     })  
        //     .catch(error => {
        //         console.log(error.message);
        //     });
    }

    let TripListItem = ({ item: trip }) => {
        return <>                
            <View style={styles.tripButton}>
                <Button onPress={() => {
                    // tripUpdate(trip);
                    navigation.navigate("Mes voyages")
                }} title={trip.name} color={'#00A5C7'}></Button>
            </View>
        </>
    }

    return <>
        <View style={styles.containerBorder}>
            {/* {isLoading ? <Text style={styles.text}>Loading...</Text> : 
                <FlatList
                    data={listeTrip}
                    renderItem={TripListItem}
                    keyExtractor={item => item.id}
                />
            } */}
            <View style={styles.tripButton}>
                <Button onPress={() => {
                    navigation.navigate("MapScreen")
                }} title={'Voyage en Grèce'} color={'#00A5C7'}></Button>
            </View>
        </View>
    </>;
};
  
export default TripListScreen;

const styles = StyleSheet.create({
    tripButton: {
        margin: 8,
        borderWidth: 1, 
        borderRadius: 3,
    },
    button: {
        margin: 5,
        borderWidth: 1, 
        borderRadius: 3,
        alignSelf: 'flex-end',
        width: 40,
    },
    containerBorder: {
        borderColor: 'black', 
        borderWidth: 1, 
        borderRadius: 3, 
        margin: 5, 
        backgroundColor: '#C0C0C0',
        overflow: 'scroll',
        maxHeight: '90%'
    },
    text: {
        fontSize: 15,
        margin: 5
    }
}); 