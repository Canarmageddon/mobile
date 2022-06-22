// MapScreen.js
import React, { useState, useRef, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Animated,
  StyleSheet,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  MapView,
  ShapeSource,
  Camera,
  PointAnnotation,
  LineLayer,
  SymbolLayer
} from "../MapBox";
import { usePosition } from "../contexts/GeolocationContext";
import checkStatus from "../utils/checkStatus";
import distanceInKmBetweenCoordinates from "../utils/calculDistance";
import CustomAlert from "../components/CustomAlert";
import TripMenu from "../components/TripMenu";
import MarkerMenu from "../components/MarkerMenu";
import { useQuery } from "react-query";
import { AntDesign } from "@expo/vector-icons";
import { useTrip } from "../context/tripContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function MapScreen({ navigation }) {
  const [position] = usePosition();
  const personMarker = require("../assets/personIcon.jpg");
  const blueMarker = require("../assets/blue_marker.png");
  const finishFlag = require("../assets/finish-flag.jpg");
  const trip = useTrip();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const menuHeight = (Dimensions.get("window").height * 18) / 100;
  const [isMarkerSelected, setIsMarkerSelected] = useState(false);
  const [markerSelected, setMarkerSelected] = useState(null);
  const [markerSelectedType, setMarkerSelectedType] = useState(null);
  const [showDescriptionPopup, setShowDescriptionPopup] = useState(false);
  const [isImageCharged, setIsImageCharged] = useState(false);

  const geoJsonFeaturePosition = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Point",
      coordinates: [position.longitude, position.latitude],
    },
  };

  const {
    isLoading: isLoadingSteps,
    isError: isErrorSteps,
    error: errorSteps,
    data: steps,
  } = useQuery(["steps", trip.id], () => getTripSteps(trip.id));
  const {
    isLoading: isLoadingPOI,
    isError: isErrorPOI,
    error: errorPOI,
    data: pointsOfInterest,
  } = useQuery(["pointsOfInterest", trip.id], () => getTripPOI(trip.id));
  const {
    isLoading: isLoadingTravels,
    isError: isErrorTravels,
    error: errorTravels,
    data: travels,
  } = useQuery(["travels", trip.id], () => getTripTravels(trip.id));
  

  const getTripPOI = (tripId) => {
    return fetch(`http://vm-26.iutrs.unistra.fr/api/trips/${tripId}/poi`)
      .then(checkStatus)
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        return data;
      })
      .catch((error) => {
        //console.log(error.message);
      });
  };

  const getTripSteps = (tripId) => {
    return fetch(`http://vm-26.iutrs.unistra.fr/api/trips/${tripId}/steps`)
      .then(checkStatus)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        return data;
      })
      .catch((error) => {
        //console.log(error.message);
      });
  };

  const getTripTravels = (tripId) => {
    return fetch(`http://vm-26.iutrs.unistra.fr/api/trips/${tripId}/travels`)
      .then(checkStatus)
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        return data;
      })
      .catch((error) => {
        //   console.log(error.message);
      });
  };

  const startAnimation = (isMarkerSelected) => {
    Animated.timing(slideAnim, {
      toValue: isMarkerSelected ? 0 : menuHeight,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (!isMarkerSelected) {
        setIsMarkerSelected(false);
        setMarkerSelected(null);
        setMarkerSelectedType(null);
      }
    });
  };

  const openItemMenu = (type, item) => {
    let initialMarkerSelectedState = isMarkerSelected;
    let markerIsTheSame =
      JSON.stringify(markerSelected) === JSON.stringify(item);
    if (!initialMarkerSelectedState) {
      startAnimation(true);
    }
    if (!markerIsTheSame) {
      setIsMarkerSelected(true);
      setMarkerSelected(item);
      setMarkerSelectedType(type);
    } else {
      startAnimation(!initialMarkerSelectedState);
    }
  };

  const StepMarker = ({ index, marker }) => {

    return (
      <PointAnnotation
        id={"step-" + index}
        children={true}
        coordinate={[marker.location.longitude, marker.location.latitude]}
        anchor={index !== steps.length - 1 ? { x: 0.5, y: 1 } : { x: 0, y: 1 }}
        onSelected={() => {
          openItemMenu("step", marker);
        }}
      >
        <Image
          id={"pointCount" + index}
          source={index !== steps.length - 1 ? blueMarker : finishFlag}
          style={{ width: 24, height: 35 }}
          onLoad={() => {
            setIsImageCharged(true);
          }}
        />
      </PointAnnotation>
    );
  };

  const POIMarker = ({ index, marker }) => {
    return (
      <PointAnnotation
        key={"point-of-interest-" + index}
        id={"point-of-interest-" + index}
        coordinate={[marker.location.longitude, marker.location.latitude]}
        onSelected={() => {
          openItemMenu("poi", marker);
        }}
      />
    );
  };

  const Travel = ({ index, travel }) => {
    let locationStart, locationEnd;

    locationStart = [travel.start.location.longitude, travel.start.location.latitude];
    locationEnd = [travel.end.location.longitude, travel.end.location.latitude];

    const geoJsonFeature = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [locationStart, locationEnd],
      },
    };

    return (
      <ShapeSource
        key={index}
        id={`route-${index}`}
        shape={geoJsonFeature}
        onPress={() => {
          openItemMenu("travel", travel);
        }}
      >
        <LineLayer
          id={`route-layer-${index}`}
          style={{
            lineColor: "steelblue",
            lineWidth: 4,
            lineJoin: "round",
            lineCap: "round",
          }}
          layerIndex={100}
        />
      </ShapeSource>
    );
  };

  useEffect(() => {
    let isPOILessThan5KmAway = false;
    pointsOfInterest?.map(poi => {
      if(distanceInKmBetweenCoordinates(poi.location.latitude, poi.location.longitude, position.latitude, position.longitude) < 5){
        isPOILessThan5KmAway = true;
      }
    })
    if(isPOILessThan5KmAway){
      alert("Vous êtes à moins de 5 kilomètres d'un point d'intérêt.");
    }
  }, [position]);

  const getStepDate = (step) => {
    if(step.date){
      let myDate = new Date(step.date);
      let splitedDate = myDate.toLocaleDateString('fr-FR').split('/');
      return splitedDate[1] + '/' + splitedDate[0] + '/' + splitedDate[2];  
    }
    else{
      return null;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <MapView
            style={{
              flex: 1,
              height: windowHeight,
              width: windowWidth,
            }}
            localizeLabels={true}
            compassViewPosition={3}
          >
            <Camera 
              zoomLevel={5} 
              centerCoordinate={[position.longitude, position.latitude]}
            />
            {isLoadingSteps
              ? null
              : steps.map((marker, index) => {
                  return (
                    <StepMarker key={index} index={index} marker={marker} />
                  );
                })}
            {isLoadingPOI
              ? null
              : pointsOfInterest.map((marker, index) => {
                  return (
                    <POIMarker key={index} index={index} marker={marker} />
                  );
                })}
            {isLoadingTravels
              ? null
              :  travels.map((travel, index) => {
                    return (
                      <Travel
                        key={index}
                        index={index}
                        travel={travel}
                      />
                    );
            })}
            <ShapeSource          //Icone de la position actuelle de l'utilisateur
              id='positionShapeSource'
              shape={geoJsonFeaturePosition}
            >
              <SymbolLayer 
                id='positionIcon' 
                style={{
                  iconImage: personMarker,
                  iconSize: 0.10,
                  iconAllowOverlap: true,
                  iconIgnorePlacement: true,
                }}
              />
            </ShapeSource>
          </MapView>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name='arrowleft' size={30} color='black' />
          </TouchableOpacity>
          <TripMenu navigation={navigation} />
          {isMarkerSelected && markerSelected ? (
            <>
              <MarkerMenu
                slideAnim={slideAnim}
                startAnimation={startAnimation}
                navigation={navigation}
                markerSelected={markerSelected}
                markerSelectedType={markerSelectedType}
                setShowDescriptionPopup={setShowDescriptionPopup}
              />
              <CustomAlert
                displayMsg={
                  ((markerSelectedType === "step" || markerSelectedType === "poi"
                    ? markerSelected.description
                    : markerSelectedType === "travel"
                    ? "Distance : " + distanceInKmBetweenCoordinates(markerSelected.start.location.latitude, markerSelected.start.location.longitude, markerSelected.end.location.latitude, markerSelected.end.location.longitude).toFixed(2) +  'KM'
                    : null) ?? 'Aucune description disponible.') +
                  (markerSelectedType === "step" 
                    ? '\n\nDate de commencement supposée : ' + (getStepDate(markerSelected) ?? 'Aucune date saisie.') 
                    : "") +
                  (markerSelectedType !== "travel"
                    ? "\n\nLongitude : " +
                      markerSelected.location.longitude +
                      "\nLatitude : " +
                      markerSelected.location.latitude
                    : "")
                }
                visibility={showDescriptionPopup}
                dismissAlert={setShowDescriptionPopup}
              />
            </>
          ) : null}
          <StatusBar style='default' />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: windowWidth,
    height: windowHeight,
    margin: 0,
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 10,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 50,
    backgroundColor: "#fff",
    marginTop: 5,
    borderColor: "black",
    borderRadius: 25,
    borderWidth: 1,
  },
});

export default MapScreen;
