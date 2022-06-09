import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Pressable, FlatList } from 'react-native';
import { useTrip } from "../context/tripContext";
import { useQuery, useQueryClient } from 'react-query';
import checkStatus from "../utils/checkStatus";
import { AntDesign, FontAwesome5 } from '@expo/vector-icons'; 

function ExpansesScreen({navigation}) {
    const trip = useTrip();
    const [currentTab, setCurrentTab] = useState(0);
    const [currentSubTab, setCurrentSubTab] = useState(0);
    const [totalCostsValue, setTotalCostsValue] = useState(0);
    const [averageCost, setAverageCost] = useState(0);
    const [numberOfTravelers, setNumberOfTravelers] = useState(0);
    const [balance, setBalance] = useState([]);
    const [balanceIsSet, setBalanceIsSet] = useState(false);

    const { isLoading: isLoadingUsers, isError: isErrorUsers, error: errorUsers, data: users } = useQuery(['users', trip.id], () => getUsers(trip.id));
    const { isLoading, isError, error, data: expanses } = useQuery(['tripExpanses', trip.id], () => getExpanses(trip.id), {enabled: balanceIsSet});

    const getUsers = tripId => {       
        return fetch(`http://vm-26.iutrs.unistra.fr/api/trips/${tripId}/users`)
            .then(checkStatus)
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                setNumberOfTravelers(data.length);
                let newBalance = [];
                data.map(user => {
                    user = user.user;
                    newBalance.push({userId: user.id, user: `${user.firstName} ${user.lastName}`, totalExpanses: 0});
                })
                setBalance(newBalance);
                setBalanceIsSet(true);
                return data;
            })  
            .catch(error => {
                console.log(error.message);
            });
    }

    const getExpanses = tripId => {
        return fetch(`http://vm-26.iutrs.unistra.fr/api/trips/${tripId}/costs`) //Faut les groups de creator dans l'objet costs poru que ça marche
            .then(checkStatus)
            .then(response => response.json())
            .then(data => {
                // console.log(data.costs);
                let tempTotalCostsValue = 0;
                let newBalance = [];
                balance.map(userBalance => {
                    newBalance.push({userId: userBalance.userId, user: userBalance.user, totalExpanses: 0});
                })
                data.map(cost => {
                    tempTotalCostsValue += cost.value;
                    newBalance.map(userBalance => {
                        if(userBalance.userId === cost.creator.id){
                            userBalance.totalExpanses += cost.value;
                        }
                    })
                });

                setBalance(newBalance);
                setTotalCostsValue(tempTotalCostsValue);
                setAverageCost(tempTotalCostsValue / numberOfTravelers);

                return data;
            })  
            .catch(error => {
                console.log(error.message);
            });
    }

    const ExpansesListItem = ({ item: expanse }) => {
        let creationDateWrongFormat = expanse.creationDate.slice(0, 10).split('-'); //Pour mettre la date au bon format 'dd-mm-YYYY'
        let creationDate = creationDateWrongFormat[2] + '-' + creationDateWrongFormat[1] + '-' + creationDateWrongFormat[0];

        return (
            <View style={styles.expanse}>
                <View>
                    <Text style={styles.textFirstLine}>{expanse.label}</Text>
                    <Text style={styles.textSecondLine}>Payé par {expanse.creator.firstName} {expanse.creator.lastName}</Text>
                </View>
                <View style={styles.secondColumn}>
                    <Text style={styles.textFirstLine}>{expanse.value} €</Text>
                    <Text style={styles.textSecondLine}>le {creationDate}</Text>
                </View>
            </View>
        );
    }

    const BalanceListItem = ({ item: balance }) => {
        return (
            <View style={styles.expanse}>
                <View>
                    <Text style={styles.textFirstLine}>{balance.user}</Text>
                </View>
                <View style={styles.secondColumn}>
                    <Text style={styles.textFirstLine}>{balance.totalExpanses} €</Text>
                </View>
            </View>
        );
    }

    const BalanceComparaisonListItem = ({ item: balance }) => {
        const balanceValue = (balance.totalExpanses - averageCost).toFixed(2);

        return (
            <View style={[styles.expanse, {backgroundColor: balanceValue < 0 ? 'red' : '#90EE90'}]}>
                <View>
                    <Text style={styles.textFirstLine}>{balance.user}</Text>
                </View>
                <View style={styles.secondColumn}>
                    <Text style={styles.textFirstLine}>{balanceValue >= 0 ? '+' : null}{balanceValue} €</Text>
                </View>
            </View>
        );
    }

    return <>
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                <View style={styles.menu}>
                    <Pressable style={[styles.menuButton, {borderRightWidth: 1, backgroundColor: currentTab === 0 ? '#606060' : '#D3D3D3'}]} 
                        onPress={() => {currentTab !== 0 ? setCurrentTab(0) : null}}
                    >
                        <FontAwesome5 name='list' size={30} color={currentTab === 0 ? 'white' : 'black'}/>
                        <Text style={[styles.textFirstLine, {fontWeight: currentTab === 0 ? 'bold' : 'normal', color: currentTab === 0 ? '#fff' : '#000'}]}>Dépenses</Text>
                    </Pressable>
                    <Pressable style={[styles.menuButton, {borderLeftWidth: 1, backgroundColor: currentTab === 1 ? '#606060' : '#D3D3D3'}]} 
                        onPress={() => {currentTab !== 1 ? setCurrentTab(1) : null}}
                    >
                        <AntDesign name="swap" size={30} color={currentTab === 1 ? 'white' : 'black'}/>
                        <Text style={[styles.textFirstLine, {fontWeight: currentTab === 1 ? 'bold' : 'normal',  color: currentTab === 1 ? '#fff' : '#000' }]}>Equilibre</Text>
                    </Pressable>
                </View>
                {
                    currentTab === 0 ?
                    <View style={styles.expansesListContainer}>
                        {isLoadingUsers || isLoading ? <Text>Loading...</Text> : 
                            <FlatList
                                data={expanses}
                                renderItem={ExpansesListItem}
                                keyExtractor={item => item.id}
                            />
                        }
                    </View> :
                    currentTab === 1 ?
                    <View style={styles.expansesListContainer}>
                        <View style={styles.menu}>
                            <Pressable style={[styles.menuButton, {borderRightWidth: 1, backgroundColor: currentSubTab === 0 ? '#606060' : '#D3D3D3'}]} 
                                onPress={() => {currentSubTab !== 0 ? setCurrentSubTab(0) : null}}
                            >
                                <Text style={[styles.textFirstLine, {fontWeight: currentSubTab === 0 ? 'bold' : 'normal', color: currentSubTab === 0 ? '#fff' : '#000'}]}>Total</Text>
                            </Pressable>
                            <Pressable style={[styles.menuButton, {borderLeftWidth: 1, backgroundColor: currentSubTab === 1 ? '#606060' : '#D3D3D3'}]} 
                                onPress={() => {currentSubTab !== 1 ? setCurrentSubTab(1) : null}}
                            >
                                <Text style={[styles.textFirstLine, {fontWeight: currentSubTab === 1 ? 'bold' : 'normal',  color: currentSubTab === 1 ? '#fff' : '#000' }]}>Comparaison</Text>
                            </Pressable>
                        </View>
                        {
                            currentSubTab === 0 ?
                                isLoadingUsers || isLoading ? <Text>Loading...</Text> : <>
                                    <FlatList
                                        data={balance}
                                        renderItem={BalanceListItem}
                                        keyExtractor={item => item.id}
                                    />
                                </> :
                            currentSubTab === 1 ?
                                isLoadingUsers || isLoading ? <Text>Loading...</Text> : <>
                                    <Text style={styles.text}>Dépenses moyennes par membre : {averageCost.toFixed(2)} €</Text>
                                    <FlatList
                                        data={balance}
                                        renderItem={BalanceComparaisonListItem}
                                        keyExtractor={item => item.id}
                                    />
                                </> :
                            null
                        }
                    </View> 
                    : null
                }
            </View>
            <Pressable onPress={() => navigation.navigate('Ajouter une dépense', {users: users})} style={styles.button}>
                <AntDesign name="plus" size={30} color="black"/>
            </Pressable>
            <View style={styles.footer}></View>
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
    menu: {
        width: '100%',
        height: '15%',
        alignItems: 'center',
        marginBottom: 5,
        flexDirection: 'row',
    },
    menuButton: {
        borderColor: 'black',
        borderWidth: 2,
        width: '50%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    expansesListContainer: {
        display: 'flex',
        margin: 5,
        marginTop: 0,
        overflow: 'scroll',
        maxHeight: '78%',
        height: '78%',
    },
    footer: {
        width: '100%',
        height: '15%',
        backgroundColor: '#9AC4F8',
        alignItems: 'center', 
        borderTopColor: 'black',
        borderTopWidth: 2
    },
    button: {
        width: 60, 
        borderRadius: 30, 
        borderColor: 'black', 
        borderWidth: 2, 
        backgroundColor: '#90EE90', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 60,
        elevation: 10,
        zIndex: 10,
        position: 'absolute',
        bottom: '10.5%'
    },
    expanse: {
        width: '100%',
        height: 80,
        backgroundColor: '#D3D3D3',
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 5,
    },
    textFirstLine: {
        fontSize: 18,
        margin: 5
    },
    textSecondLine: {
        fontSize: 13,
        margin: 5
    },
    text: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5
    },
    secondColumn: {
        alignItems: 'flex-end',
    }
});

export default ExpansesScreen;