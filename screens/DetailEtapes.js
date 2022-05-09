import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useQuery, useQueryClient } from "react-query";
import checkStatus from "../utils/checkStatus";

function DetailEtapes() {
  const [selectedStep, setSelectedStep] = useState(null);
  const {
    isLoading: isLoadingPoi,
    isError: isErrorPoi,
    error: erroPoi,
    data: dataPoi,
  } = useQuery("poi", () => getPoi());
  const {
    isLoading: isLoadingSteps,
    isError: isErrorSteps,
    error: erroSteps,
    data: dataSteps,
  } = useQuery("steps", () => getSteps());
  const getPoi = () => {
    return fetch("http://vm-26.iutrs.unistra.fr/api/trips/1/poi")
      .then(checkStatus)
      .then((response) => response.json())
      .catch((error) => {
        console.log(error.message);
      });
  };
  const getSteps = () => {
    return fetch("http://vm-26.iutrs.unistra.fr/api/trips/1/steps")
      .then(checkStatus)
      .then((response) => response.json())
      .catch((error) => {
        console.log(error.message);
      });
  };
  const handlePress = (i) => {
    if (selectedStep == i) setSelectedStep(null);
    else setSelectedStep(i);
  };
  if (isLoadingSteps) return <View></View>;
  if (isErrorSteps) return <Text>{erroSteps}</Text>;
  return (
    <View>
      <Text style={styles.title}>Liste des étapes</Text>
      {dataSteps.map((step, i) => (
        <View key={i}>
          <TouchableOpacity onPress={() => handlePress(i)}>
            <Text>{step.description}</Text>
          </TouchableOpacity>
          {selectedStep == i && !isLoadingPoi && !isErrorPoi ? (
            <View>
              {dataPoi.map((poi) =>
                poi.step == step.id ? (
                  <View>
                    <Text>{poi.description}</Text>
                    <View style={styles.smallSeparation}></View>
                  </View>
                ) : (
                  <View></View>
                ),
              )}
            </View>
          ) : (
            <View></View>
          )}
          <View style={styles.bigSeparation}></View>
        </View>
      ))}
      {!isLoadingPoi && !isErrorPoi && (
        <View>
          <Text style={styles.title}>
            Points d'intérets reliés à aucune étapes
          </Text>
          {dataPoi.map((poi, i) =>
            poi.step == null ? (
              <View key={i}>
                <Text>{poi.description}</Text>
                <View style={styles.smallSeparation}></View>
              </View>
            ) : (
              <View></View>
            ),
          )}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  bigSeparation: {
    height: 4,
    backgroundColor: "#9AC4F8",
  },
  smallSeparation: {
    height: 1,
    backgroundColor: "#000000",
  },
  title: {
    fontSize: 25,
  },
});
export default DetailEtapes;
