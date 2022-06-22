import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal } from 'react-native';
import { useTrip } from "../context/tripContext";
import { useUser } from "../context/userContext";
import { useQuery, useQueryClient } from 'react-query';
import checkStatus from "../utils/checkStatus";
import { AntDesign, FontAwesome5 } from '@expo/vector-icons'; 

function ExpansesScreen({navigation}) {
    const trip = useTrip();
    const [connectedUser] = useUser();
    const [currentTab, setCurrentTab] = useState(0);
    const [currentSubTab, setCurrentSubTab] = useState(0);
    const [totalPayed, setTotalPayed] = useState([]);
    const [totalPayedIsSet, setTotalPayedIsSet] = useState(false);
    const [balanceComparison, setBalanceComparison] = useState([]);
    const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
    const [currentExpanseBeneficiaries, setCurrentExpanseBeneficiaries] = useState([]);
    const queryClient = useQueryClient();

    const { isLoading: isLoadingUsers, isError: isErrorUsers, error: errorUsers, data: users } = useQuery(['users', trip.id], () => getUsers(trip.id));
    const { isLoading, isError, error, data: expanses } = useQuery(['tripExpanses', trip.id], () => getExpanses(trip.id), {enabled: totalPayedIsSet});

    useEffect(()=>{
        setTotalPayedIsSet(false);
    }, [])
    
    const getUsers = tripId => {       
        return fetch(`http://vm-26.iutrs.unistra.fr/api/trips/${tripId}/users`)
            .then(checkStatus)
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                let userTotalPayed = [];
                data.map(user => {
                    user = user.user;
                    userTotalPayed.push({userId: user.id, user: `${user.name ?? user.firstName + ' ' + user.lastName}`, totalExpanses: 0});
                })
                setTotalPayed(userTotalPayed);
                setTotalPayedIsSet(true);
                return data;
            })
            .catch(error => {
                console.log(error.message);
            });
    }

    const getExpanses = tripId => {
        return fetch(`http://vm-26.iutrs.unistra.fr/api/trips/${tripId}/costs`)
            .then(checkStatus)
            .then(response => response.json())
            .then(data => {
                // console.log(data.costs);
                let userTotalPayed = [];
                totalPayed.map(userBalance => {
                    userTotalPayed.push({userId: userBalance.userId, user: userBalance.user, totalExpanses: 0});
                })
                data.map(cost => {
                    userTotalPayed.map(userBalance => {
                        if(userBalance.userId === cost.creator?.id){
                            userBalance.totalExpanses += cost.value;
                        }
                    })
                });

                setTotalPayed(userTotalPayed);
                compareExpansesDue(queryClient.getQueriesData(['users', trip.id])[0][1], data);

                return data;
            })  
            .catch(error => {
                console.log(error.message);
            });
    }

    function compareExpansesDue(users, expanses) {
        let comparisonArray = [];
        users.map(user => {
            user = user.user;
            let transmitter = {id: user.id, identity: `${user.name ?? user.firstName + ' ' + user.lastName}`};
            users.map(userToBeBeneficary => {
                userToBeBeneficary = userToBeBeneficary.user;
                if(user.id !== userToBeBeneficary.id){
                    let beneficiary = {id: userToBeBeneficary.id, identity: `${userToBeBeneficary.name ?? userToBeBeneficary.firstName + ' ' + userToBeBeneficary.lastName}`};
                    comparisonArray.push({transmitter: transmitter, valueDue: 0, beneficiary: beneficiary});    
                }
            })
        });
        expanses.map(expanse => {
            comparisonArray.map(userDue => {
                let beneficiaries = expanse.costUsers;
                beneficiaries.map(beneficiary => {
                    beneficiary = beneficiary.user;
                    let valueDue = parseFloat((expanse.value / beneficiaries.length).toFixed(2));
                    if(userDue.transmitter.id === expanse.creator.id && userDue.beneficiary.id === beneficiary.id){
                        userDue.valueDue += valueDue;
                    }
                    else if(userDue.transmitter.id === beneficiary.id && userDue.beneficiary.id === expanse.creator.id){
                        userDue.valueDue -= valueDue;
                    }
                });
            });
        });
        setBalanceComparison(comparisonArray);
    }

    const ExpansesListItem = ({ item: expanse, index }) => {
        let creationDateWrongFormat = expanse.creationDate.slice(0, 10).split('-'); //Pour mettre la date au bon format 'dd-mm-YYYY'
        let creationDate = creationDateWrongFormat[2] + '-' + creationDateWrongFormat[1] + '-' + creationDateWrongFormat[0];

        return <TouchableOpacity key={'expanse' + index} style={[styles.expanse, {borderColor: '#2c75ff'}]} onPress={() => {
                setCurrentExpanseBeneficiaries(expanse.costUsers);
                setShowConfirmationPopup(true);
            }}>
            <View style={styles.firstColumn}>
                <Text style={styles.textFirstLine}>{expanse.label}</Text>
                <Text style={styles.textSecondLine}>Payé par {expanse.creator.name ?? expanse.creator.firstName + ' ' + expanse.creator.lastName}</Text>
            </View>
            <View style={styles.secondColumn}>
                <Text style={styles.textFirstLine}>{expanse.value} €</Text>
                <Text style={styles.textSecondLine}>le {creationDate}</Text>
            </View>
        </TouchableOpacity>;
    }

    const TotalPayedListItem = ({ item: totalPayed, index }) => {
        return <View key={'totalPayed' + index} style={styles.expanse}>
            <View style={styles.firstColumn}>
                <Text style={styles.textFirstLine}>{totalPayed.user}</Text>
            </View>
            <View style={styles.secondColumn}>
                <Text style={styles.textFirstLine}>{totalPayed.totalExpanses} €</Text>
            </View>
        </View>;
    }

    const BalanceComparaisonListItem = ({ item: balance, index }) => {
        return <View key={'balanceComparison' + index} style={[styles.expanse, {flexDirection: 'column'}]}>
            <View style={styles.expanseDueLine}>
                <Text style={[styles.coloredText, {color: balance.beneficiary.id === connectedUser.id ? '#90EE90' : '#14274e'}]}>{balance.beneficiary.identity}</Text>
                <Text style={styles.expanseDueText}>doit {balance.valueDue} €</Text>
            </View>
            <View style={styles.expanseDueLine}>
                <Text style={styles.expanseDueText}>à</Text>
                <Text style={[styles.coloredText, {color: balance.transmitter.id === connectedUser.id ? '#90EE90' : '#14274e'}]}>{balance.transmitter.identity}</Text>
            </View>
        </View>;
    }

    return <>
        <View style={styles.mainContainer}>
            <View style={styles.container}>
                <View style={styles.menu}>
                    <TouchableOpacity style={[styles.menuButton, {borderRightWidth: 1, backgroundColor: currentTab === 0 ? '#606060' : '#D3D3D3'}]} 
                        onPress={() => {currentTab !== 0 ? setCurrentTab(0) : null}}
                    >
                        <FontAwesome5 name='list' size={30} color={currentTab === 0 ? 'white' : 'black'}/>
                        <Text style={[styles.textFirstLine, {fontWeight: currentTab === 0 ? 'bold' : 'normal', color: currentTab === 0 ? '#fff' : '#000'}]}>Dépenses</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.menuButton, {borderLeftWidth: 1, backgroundColor: currentTab === 1 ? '#606060' : '#D3D3D3'}]} 
                        onPress={() => {currentTab !== 1 ? setCurrentTab(1) : null}}
                    >
                        <AntDesign name="swap" size={30} color={currentTab === 1 ? 'white' : 'black'}/>
                        <Text style={[styles.textFirstLine, {fontWeight: currentTab === 1 ? 'bold' : 'normal',  color: currentTab === 1 ? '#fff' : '#000' }]}>Equilibre</Text>
                    </TouchableOpacity>
                </View>
                {
                    currentTab === 0 ?
                    <View style={styles.expansesListContainer}>
                        {isLoadingUsers || isLoading ? <Text style={{textAlign: 'center', fontSize: 20}}>Chargement...</Text> : 
                            expanses.length > 0 ? 
                            <FlatList
                                data={expanses}
                                renderItem={ExpansesListItem}
                                keyExtractor={item => item.id}
                            />
                            :
                            <Text style={{textAlign: 'center', fontSize: 20}}>Aucune dépense n'a été enregistrée.</Text>
                        }
                    </View> :
                    currentTab === 1 ?
                    <View style={styles.expansesListContainer}>
                        <View style={styles.menu}>
                            <TouchableOpacity style={[styles.subMenuButton, {backgroundColor: currentSubTab === 0 ? '#606060' : '#D3D3D3'}]} 
                                onPress={() => {currentSubTab !== 0 ? setCurrentSubTab(0) : null}}
                            >
                                <Text style={[styles.subMenuButtonText, {fontWeight: currentSubTab === 0 ? 'bold' : 'normal', color: currentSubTab === 0 ? '#fff' : '#000'}]}>Total</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.subMenuButton, {borderLeftWidth: 0, backgroundColor: currentSubTab === 1 ? '#606060' : '#D3D3D3'}]} 
                                onPress={() => {currentSubTab !== 1 ? setCurrentSubTab(1) : null}}
                            >
                                <Text style={[styles.subMenuButtonText, {fontWeight: currentSubTab === 1 ? 'bold' : 'normal',  color: currentSubTab === 1 ? '#fff' : '#000' }]}>Dettes</Text>
                            </TouchableOpacity>
                        </View>
                        {
                            currentSubTab === 0 ?
                                isLoadingUsers || isLoading ? <Text style={{textAlign: 'center', fontSize: 20}}>Chargement...</Text> : <>
                                    <FlatList
                                        data={totalPayed}
                                        renderItem={TotalPayedListItem}
                                        keyExtractor={item => item.id}
                                    />
                                </> :
                            currentSubTab === 1 ?
                                isLoadingUsers || isLoading ? <Text >Chargement...</Text> : <>
                                    <FlatList
                                        data={balanceComparison.filter(item => item.valueDue > 0)}
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
            <TouchableOpacity onPress={() => navigation.navigate('Ajouter une dépense', {users: users})} style={styles.button}>
                <AntDesign name="plus" size={30} color="black"/>
            </TouchableOpacity>
            <View style={styles.footer}></View>
            <View>
                <Modal visible={showConfirmationPopup} transparent={true} animationType="fade">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalWindow}>
                            <View style={styles.modalTextView}>
                                <Text style={styles.modalText}>Liste des bénéficiaires de la dépense : </Text>
                                {
                                    currentExpanseBeneficiaries.map((beneficiary, index) => {
                                        return <Text key={'beneficiary-' + index} style={styles.modalText}>- {beneficiary.user.name ?? beneficiary.user.firstName + ' ' + beneficiary.user.lastName}</Text>
                                    })
                                }
                            </View>
                            <View style={styles.modalButtonView}>
                                <TouchableOpacity
                                    onPress={() => setShowConfirmationPopup(false)}
                                    style={styles.modalButton}
                                >
                                    <Text style={styles.modalButtonText}>Fermer</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
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
        borderTopWidth: 0,
        width: '50%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    subMenuButton:{
        borderColor: 'black',
        borderWidth: 2,
        width: '50%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    subMenuButtonText:{
        fontSize: 16,
        margin: 5,
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
    textFirstLine: {
        fontSize: 18,
        margin: 5,
        color: '#fff',
        fontWeight: 'bold'
    },
    textSecondLine: {
        fontSize: 13,
        margin: 5,
        color: '#fff',
    },
    text: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 5
    },
    expanse: {
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
    expanseDueLine: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    expanseDueText: {
        fontSize: 18,
        margin: 5,
        color: '#fff',
    },
    coloredText: {
        fontSize: 18,
        margin: 5,
        fontWeight: 'bold',
    },
    firstColumn: {
        alignItems: 'flex-start',
        maxWidth: '65%',
        marginLeft: 25,
    },
    secondColumn: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        maxWidth: '35%',
        marginRight: 25,
    },
    modalButton: {
        width: '48%',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#2c75ff',
        backgroundColor: '#9AC4F8',
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderRadius: 5,
        marginBottom: 10,
    }, 
    modalButtonText: {
        color: '#fff', 
        margin: 15
    },
    modalButtonView: {
        margin: 10, 
        width: '95%', 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-evenly'
    }, 
    modalTextView: {
        margin: 10, 
        width: '90%'
    }, 
    modalText: {
        fontSize: 16, 
        marginTop: 5
    }, 
    modalWindow: {
        alignItems: 'center', 
        justifyContent: 'space-between', 
        backgroundColor: '#fff', 
        minHeight: 200, 
        width: '90%', 
        borderRadius: 7, 
        elevation: 10
    },
    modalContainer: {
        flex: 1, 
        backgroundColor: 'rgba(52, 52, 52, 0.8)', 
        alignItems: 'center', 
        justifyContent: 'center'
    }
});

export default ExpansesScreen;