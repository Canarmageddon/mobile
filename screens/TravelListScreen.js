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
// import { useTravelUpdate } from "../context/travelContext";

const TravelListScreen = ({navigation, route}) => {
    // const [user] = useUser();
    // const travelUpdate = useTravelUpdate();
    // const queryClient = useQueryClient();

    // const { isLoading, isError, error, data: listeTravel } = useQuery(['listeTravel', user.id], () => getUserTravels(user.id));

    const getUserTravels = userId => {
        // return fetch('http://' + userId +'/travel')
        //     .then(checkStatus)
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log(data);
        //         queryClient.setQueryData(['listeTravel', user.id], listeTravel);
        //         return data;
        //     })  
        //     .catch(error => {
        //         console.log(error.message);
        //     });
    }

    let ListeTravelItem = ({ item: travel }) => {
        return <>                
            <View style={styles.travelButton}>
                <Button onPress={() => {
                    // travelUpdate(travel);
                    navigation.navigate("Mes voyages")
                }} title={travel.name} color={'#00A5C7'}></Button>
            </View>
        </>
    }

    return <>
        <View style={styles.containerBorder}>
            {/* {isLoading ? <Text style={styles.text}>Loading...</Text> : 
                <FlatList
                    data={listeTravel}
                    renderItem={ListeTravelItem}
                    keyExtractor={item => item.id}
                />
            } */}
            <View style={styles.travelButton}>
                <Button onPress={() => {
                    navigation.navigate("MapScreen")
                }} title={'Voyage en Grèce'} color={'#00A5C7'}></Button>
            </View>
        </View>
    </>;
};
  
export default TravelListScreen;

const styles = StyleSheet.create({
    travelButton: {
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