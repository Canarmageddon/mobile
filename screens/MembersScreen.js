import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useTrip } from "../context/tripContext";
import { useQuery } from 'react-query';
import checkStatus from "../utils/checkStatus";

function MembersScreen() {
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
            <View key={member.user.id} style={styles.membre}>
                <Text style={[styles.text, {fontWeight: 'bold'}]}>{member.user.name ?? member.user.firstName + ' ' + member.user.lastName}</Text>
                <Text style={styles.text}>{member.user.name ? 'Invité' : 'Editeur'}</Text>
            </View>
        </>
    }

    return <>
        <View style={styles.view}>
            {isLoading ? <Text style={{textAlign: 'center', fontSize: 20}}>Chargement...</Text> : 
                <FlatList
                    data={members}
                    renderItem={MemberListItem}
                    keyExtractor={item => item.id}
                />
            }
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
        marginHorizontal: 25,
        marginVertical: 5
    },
    button: {
        margin: 10,
        borderWidth: 1, 
        borderRadius: 3,
    },
    membre: {
        margin: 5,
        borderRadius: 1,
        backgroundColor: '#9AC4F8',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#000',
        borderRadius: 5,
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 4,
        borderBottomWidth: 4,
    },
});

export default MembersScreen;