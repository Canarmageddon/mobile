// MapScreen.js
import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Pressable,
  Button,
  Modal,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  MapView,
  MarkerView,
  ShapeSource,
  Camera,
  PointAnnotation,
  SymbolLayer,
  VectorSource,
  LineLayer,
  Callout,
} from "../MapBox";
import checkStatus from "../utils/checkStatus";
import CustomAlert from "../components/CustomAlert";
import TravelMenu from "../components/TravelMenu";
import MarkerMenu from "../components/MarkerMenu";
import { useQuery, useQueryClient } from "react-query";
import { AntDesign } from '@expo/vector-icons'; 
import { useTrip } from "../context/tripContext";
navigator.geolocation = require("@react-native-community/geolocation");

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

function getWindowSize() {
  // return "width : " +  windowWidth + ", height : " + windowHeight;
  return "width : 100, height : 50";
}

function MapScreen({ navigation }) {
  useEffect(() => {
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      });
    }, 100000);
    return () => {
      clearInterval(interval);
    };
  });
  const blueMarker = require('../assets/blue_marker.png');
  const trip = useTrip();
  const slideAnim = useRef(new Animated.Value(0)).current
  const menuHeight = Dimensions.get('window').height * 18 / 100;
  const [travelCoordinate, setTravelCoordinate] = useState([]);
  const [isMarkerSelected, setIsMarkerSelected] = useState(false);
  const [markerSelected, setMarkerSelected] = useState(null);
  const [markerSelectedType, setMarkerSelectedType] = useState(null);
  const [showDescriptionPopup, setShowDescriptionPopup] = useState(false);
  const [isImageCharged, setIsImageCharged] = useState(false);
  const [stepIsSet, setStepIsSet] = useState(false);
  const [centerCoordinate, setCenterCoordinate] = useState([0, 0]);
  const [position, setPosition] = useState({});

  const { isLoading: isLoadingSteps, isError: isErrorSteps, error: errorSteps, data: steps } = useQuery(['steps', trip.id], () => getTripSteps(trip.id));
  const { isLoading: isLoadingPOI, isError: isErrorPOI, error: errorPOI, data: pointsOfInterest } = useQuery(['pointsOfInterest', trip.id], () => getTripPOI(trip.id));
  const { isLoading: isLoadingTravels, isError: isErrorTravels, error: errorTravels, data: travels } = useQuery(['travels', trip.id], () => getTripTravels(trip.id), {enabled: stepIsSet});

  const getTripPOI = tripId => {
    return fetch(`http://vm-26.iutrs.unistra.fr/api/trips/${tripId}/poi`)
      .then(checkStatus)
      .then(response => response.json())
      .then(data => {
          // console.log(data);
          return data;
      })  
      .catch(error => {
          console.log(error.message);
      });
  };

  const getTripSteps = tripId => {
    return fetch(`http://vm-26.iutrs.unistra.fr/api/trips/${tripId}/steps`)
      .then(checkStatus)
      .then(response => response.json())
      .then(data => {
          // console.log(data);
          setStepIsSet(true);
          setCenterCoordinate([data[0].location.longitude, data[0].location.latitude]);

          return data;
      })  
      .catch(error => {
          console.log(error.message);
      });
  }

  const getTripTravels = tripId => {
    return fetch(`http://vm-26.iutrs.unistra.fr/api/trips/${tripId}/travels`)
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
    let markerIsTheSame = JSON.stringify(markerSelected) === JSON.stringify(item);
    if(!initialMarkerSelectedState){
      startAnimation(true);
    }
    if(!markerIsTheSame){
      setIsMarkerSelected(true);
      setMarkerSelected(item);
      setMarkerSelectedType(type);
    }
    else{
      startAnimation(!initialMarkerSelectedState);
    }
  }

  const StepMarker = ({index, marker}) => {
    return (
      <PointAnnotation
        id={"step-" + index}
        children={true}
        coordinate={[marker.location.longitude, marker.location.latitude]}
        anchor={{x: 0.5, y: 1}}
        onSelected={() => {openItemMenu('step', marker)}}
      >
        <Image
          id={"pointCount" + index}
          source={blueMarker}
          style={{ width: 24, height: 35}}
          onLoad={() => {
            setIsImageCharged(true);
          }}
        />
      </PointAnnotation>
  )};
  
  const POIMarker = ({index, marker}) => {
    return <PointAnnotation
      key={"point-of-interest-" + index}
      id={"point-of-interest-" + index}
      coordinate={[marker.location.longitude, marker.location.latitude]}
      onSelected={() => {openItemMenu('poi', marker)}}
    />;
  }

  const Travel = ({index, travel, steps}) => {
    let locationStart, locationEnd;

    steps.map(step => {
      if(step.id === travel.start.id) {
        locationStart = [step.location.longitude, step.location.latitude];
      }
      else if(step.id === travel.end.id) {
        locationEnd = [step.location.longitude, step.location.latitude];
      }
    });

    const geoJsonFeature = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [locationStart, locationEnd],
      },
    };

    return <ShapeSource key={index} id={`route-${index}`} shape={geoJsonFeature} onPress={() => {openItemMenu('travel', travel)}}>
              <LineLayer
                id={`route-layer-${index}`}
                style={{
                  lineColor: 'steelblue',
                  lineWidth: 4,
                  lineJoin: 'round',
                  lineCap: 'round',
                }}              
                layerIndex={200}
              />
            </ShapeSource>;
  }

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
              centerCoordinate={[centerCoordinate[0], centerCoordinate[1]]}
            />
            {
              isLoadingSteps ? null :             
              steps.map((marker, index) => {
                return <StepMarker key={index} index={index} marker={marker}/>;
              })
            }
            {
              isLoadingPOI ? null :
              pointsOfInterest.map((marker, index) => {
                return <POIMarker key={index} index={index} marker={marker}/>;
              })
            }
            {
              !stepIsSet || isLoadingTravels ? null :
              travels.map((travel, index) => {
                return <Travel key={index} index={index} travel={travel} steps={steps}/>;
              })
            }
          </MapView>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={30} color="black"/> 
          </Pressable>
          <TravelMenu navigation={navigation}/>
          {
            isMarkerSelected && markerSelected ?
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
                displayMsg={(markerSelectedType === 'step' ? markerSelected.description : 
                markerSelectedType === 'poi' ? markerSelected.location.name : 
                markerSelectedType === 'travel' ? 'Durée : ' + markerSelected.duration : null) +
                (markerSelectedType !== 'travel' ? '\nLongitude : ' + markerSelected.location.longitude + '\nLatitude : ' + markerSelected.location.latitude : '  ')}
                visibility={showDescriptionPopup}
                dismissAlert={setShowDescriptionPopup}
              />
            </>
            : null
          }
          <StatusBar style="default"/>
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
    margin: 0
  },    
  backButton: {
    position: 'absolute',
    left: 10,
    top: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
    backgroundColor: "#fff",
    marginTop: 5,
    borderColor: "black",
    borderRadius: 25,
    borderWidth: 1,
  },
});

export { getWindowSize, MapScreen };
