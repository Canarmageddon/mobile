import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useQueryClient } from "react-query";
import { useTrip } from "../context/tripContext";
import { FontAwesome5 } from "@expo/vector-icons";

function DetailEtapes() {
  const trip = useTrip();
  const queryClient = useQueryClient();
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedStep, setSelectedStep] = useState(null);
  const dataPoi = queryClient.getQueryData(["pointsOfInterest", trip.id]);
  const dataSteps = queryClient.getQueryData(["steps", trip.id]);
  
  const handlePress = (i) => {
    if (selectedStep == i) setSelectedStep(null);
    else setSelectedStep(i);
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
              <Text style={[styles.menuText, {fontWeight: currentTab === 1 ? 'bold' : 'normal',  color: currentTab === 1 ? '#fff' : '#000' }]}>Points d'intérets reliés à aucune étape</Text>
          </TouchableOpacity>
      </View>
      {
        currentTab === 0 ? 
        <ScrollView>
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
                
                  {dataPoi.map((poi) => {
                    poi.step == step.id ? 
                    <View style={styles.poi}> 
                      <Text style={styles.poiText}>{poi.description}</Text>
                    </View> : 
                    <View></View>
                  })}
                </>
              }
            </View>  
        ))}
        </ScrollView> :
        currentTab === 1 ? 
          <ScrollView>
            {dataPoi.map((poi, i) =>
              poi.step == null ? (
                <View key={i} style={[styles.poi, {marginLeft: 1}]}>
                  <Text style={styles.poiText}>{poi.description}</Text>
                </View>
              ) : (
                <View></View>
              )
            )}
          </ScrollView> : null
      }
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
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
      width: '50%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center'
  },
});
export default DetailEtapes;
