import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from "react-native";
import { useQueryClient } from "react-query";
import { useTrip } from "../context/tripContext";
import { useUser } from "../context/userContext";
import { FontAwesome5 } from "@expo/vector-icons";
import checkStatus from "../utils/checkStatus";

function DetailEtapes({navigation}) {
  const [user, token] = useUser();
  const trip = useTrip();
  const queryClient = useQueryClient();
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedStep, setSelectedStep] = useState(null);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const dataPoi = queryClient.getQueryData(["pointsOfInterest", trip.id]);
  const dataSteps = queryClient.getQueryData(["steps", trip.id]);
  
  const handlePress = (i) => {
    if (selectedStep == i) setSelectedStep(null);
    else setSelectedStep(i);
  };

  const defineTripAsEnded = (tripID) => {
    return fetch(`http://vm-26.iutrs.unistra.fr/api/trips/${tripID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({isEnded: true})
    })
    .then(checkStatus)
    .then((response) => response.json())
    .then((data) => {
      queryClient.setQueryData(['listeTrip', user.id], items => items = items.filter(i => i.id !== tripID));
      navigation.navigate('Mes voyages');
      return data;
    })
    .catch((error) => {
      if(error.message === "Expired JWT Token"){
        refreshToken();
        defineTripAsEnded(tripID);
      }
      console.log(error);
    })
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.menu}>
          <TouchableOpacity style={[styles.menuButton, {borderRightWidth: 1, backgroundColor: currentTab === 0 ? '#606060' : '#D3D3D3'}]} 
              onPress={() => {currentTab !== 0 ? setCurrentTab(0) : null}}
          >
              <Text style={[styles.menuText, {fontWeight: currentTab === 0 ? 'bold' : 'normal', color: currentTab === 0 ? '#fff' : '#000'}]}>Liste des étapes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuButton, {borderLeftWidth: 1, backgroundColor: currentTab === 1 ? '#606060' : '#D3D3D3'}]} 
              onPress={() => {currentTab !== 1 ? setCurrentTab(1) : null}}
          >
              <Text style={[styles.menuText, {fontWeight: currentTab === 1 ? 'bold' : 'normal',  color: currentTab === 1 ? '#fff' : '#000' }]}>Points d'intérêt non reliés à une étape</Text>
          </TouchableOpacity>
      </View>
      {
        currentTab === 0 ? 
        <ScrollView style={styles.scrollView}>
          {dataSteps.map((step, i) => (
            <View key={i}>
              {
                selectedStep !== i ?
                <TouchableOpacity style={styles.step} onPress={() => handlePress(i)}>
                  <FontAwesome5 name={'chevron-right'} size={20} color={'#9AC4F8'}/> 
                  <Text style={styles.stepText}>{step.description}</Text>
                </TouchableOpacity> :
                <>
                  <TouchableOpacity style={[styles.step, {backgroundColor: '#9AC4F8', borderColor: '#2c75ff'}]} onPress={() => handlePress(i)}>
                    <FontAwesome5 name={'chevron-down'} size={20} color={'#fff'}/>
                    <Text style={[styles.stepText, {color: '#fff'}]}>{step.description}</Text>
                  </TouchableOpacity>
                
                  {dataPoi.map((poi, index) => {
                    return poi.step?.id === step.id ? 
                      <View key={'poi' + index} style={styles.poi}> 
                        <Text style={styles.poiText}>{poi.title}</Text>
                      </View> 
                      : 
                      null
                  })}
                </>
              }
            </View>  
        ))}
        </ScrollView> :
        currentTab === 1 ? 
          <ScrollView>
            {dataPoi.map((poi, i) =>
              poi.step == null ? 
                <View key={i} style={[styles.poi, {marginLeft: 1}]}>
                  <Text style={styles.poiText}>{poi.title}</Text>
                </View>
              : null
            )}
          </ScrollView> : null
      }
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowConfirmationPopup(true)}
        >
          <Text style={styles.buttonText}>Définir le voyage comme terminé</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Modal visible={showConfirmationPopup} transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalWindow}>
              <View style={styles.modalTextView}>
                <Text style={styles.modalText}>Êtes-vous sûr de vouloir définir le voyage comme terminé ? Il ne sera plus accessible via l'application mobile pour tous les participants.</Text>
              </View>
              <View style={styles.modalButtonView}>
                <TouchableOpacity
                  onPress={() => setShowConfirmationPopup(false)}
                  style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => defineTripAsEnded(trip.id)}
                  style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Confirmer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
  },
  scrollView: {
    height: '70%'
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 1,
    marginBottom: 5,
    padding: 5,
    borderColor: "#9AC4F8",
    borderRadius: 5,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 4,
    borderBottomWidth: 4,
  },
  stepText: {
    fontSize: 18,
    margin: 10,
    marginBottom: 5,
    marginTop: 5,
    color: '#000'
  },
  poi: {
    margin: 1,
    marginLeft: 30,
    marginBottom: 5,
    padding: 5,
    borderColor: "#000",
    borderRadius: 5,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 4,
    borderBottomWidth: 4,
  },
  poiText: {
    fontSize: 17,
    margin: 10,
    marginBottom: 5,
    marginTop: 5
  },
  menuText:{
    fontSize: 18,
    margin: 5
  },
  menu: {
    width: '100%',
    height: '15%',
    minHeight: '15%',
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
  buttonContainer: {
    width: '100%',
    height: '15%',
    backgroundColor: '#9AC4F8',
    alignItems: 'center', 
    justifyContent: 'center',
    borderTopWidth: 2,
    borderTopColor: '#000',
  },
  button: {
    borderRadius: 4, 
    backgroundColor: '#dc3545', 
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
    textAlign: 'justify',
    fontSize: 16, 
    marginTop: 5
  }, 
  modalWindow: {
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: '#fff', 
    height: 200, 
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
export default DetailEtapes;
