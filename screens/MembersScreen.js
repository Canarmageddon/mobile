import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Pressable, FlatList, Button } from 'react-native';
import { useTrip } from "../context/tripContext";
import { useQuery, useQueryClient } from 'react-query';
import checkStatus from "../utils/checkStatus";

function MembersScreen({navigation}) {
    const trip = useTrip();

    const { isLoading, isError, error, data: members } = useQuery(['tripMembers', trip.id], () => getTripMembers(trip.id));

    const getTripMembers = tripId => {
        return fetch(`http://vm-26.iutrs.unistra.fr/api/trips/${tripId}/users`)
            .then(checkStatus)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                return data;
            })  
            .catch(error => {
                console.log(error.message);
            });
    }

    const MemberListItem = ({ item: member }) => {
        return <>
            <View key={member.id} style={styles.containerBorder}>
                <View style={styles.membre}>
                    <Text style={[styles.text, {fontWeight: 'bold'}]}>{member.user.firstName + ' ' + member.user.lastName}</Text>
                </View>
            </View>
        </>
    }

    return <>
        <View style={styles.view}>
            <View style={styles.containerBorder}>
                {isLoading ? <Text>Loading...</Text> : 
                    <FlatList
                        data={members}
                        renderItem={MemberListItem}
                        keyExtractor={item => item.id}
                    />
                }
            </View>
        </View>
    </>;
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1, 
        borderRadius: 3,
    },
    input: {
        borderWidth: 1,
        width: '100%',
        padding: 5
    },
    view: {
        margin: 5,
    },
    text: {
        color: '#fefefe',
        margin: 5
    },
    button: {
        margin: 10,
        borderWidth: 1, 
        borderRadius: 3,
    },
    containerBorder: {
        borderColor: 'black', 
        borderWidth: 1, 
        borderRadius: 3, 
        backgroundColor: '#C0C0C0',
        margin: 10,
    },
    membre: {
        borderRadius: 1,
        backgroundColor: "#2c75ff",
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center'
    }
});

export default MembersScreen;