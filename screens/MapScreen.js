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
      console.log(position);
      console.log("aaaaaaaaaa");
    }, 100000);
    return () => {
      clearInterval(interval);
    };
  });

  const [travelCoordinate, setTravelCoordinate] = useState([]);
  const [isMarkerSelected, setIsMarkerSelected] = useState(false);
  const [markerSelected, setMarkerSelected] = useState(null);
  const [markerSelectedType, setMarkerSelectedType] = useState(null);
  const [showDescriptionPopup, setShowDescriptionPopup] = useState(false);
  const blueMarker = require("../assets/blue_marker.png");
  const [isImageCharged, setIsImageCharged] = useState(false);
  const menuHeight = (Dimensions.get("window").height * 18) / 100;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [position, setPosition] = useState({});

  const {
    isLoading,
    isError,
    error,
    data: trip,
  } = useQuery("trip", () => getTrip());

  const getTrip = () => {
    return fetch("http://vm-26.iutrs.unistra.fr/api/trips/1")
      .then(checkStatus)
      .then((response) => response.json())
      .then((data) => {
        let travelCoordinates = [];
        data.steps.map((step) =>
          travelCoordinates.push([
            step.location.longitude,
            step.location.latitude,
          ]),
        );
        setTravelCoordinate(travelCoordinates);
        return data;
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const geoJsonFeature = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: travelCoordinate,
    },
  };
  console.log(position);
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

  const CustomMarker = ({ index, marker }) => {
    return (
      <PointAnnotation
        id={"step-" + index}
        children={true}
        coordinate={[marker.location.longitude, marker.location.latitude]}
        anchor={{ x: 0.5, y: 1 }}
        onSelected={() => {
          let initialMarkerSelectedState = isMarkerSelected;
          let markerIsTheSame =
            JSON.stringify(markerSelected) === JSON.stringify(marker);
          if (!initialMarkerSelectedState) {
            startAnimation(true);
          }
          if (!markerIsTheSame) {
            setIsMarkerSelected(true);
            setMarkerSelected(marker);
            setMarkerSelectedType("step");
          } else {
            startAnimation(!initialMarkerSelectedState);
          }
        }}
      >
        <Image
          id={"pointCount" + index}
          source={blueMarker}
          style={{ width: 28, height: 40 }}
          onLoad={() => {
            setIsImageCharged(true);
          }}
        />
      </PointAnnotation>
    );
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
            compassViewPosition={0}
          >
            <PointAnnotation
              key={"position"}
              id={"position"}
              coordinate={[position.longitude, position.latitude]}
            />
            <Camera zoomLevel={5} centerCoordinate={travelCoordinate[0]} />
            {isLoading
              ? null
              : trip.steps.map((marker, index) => {
                  return (
                    <CustomMarker key={index} index={index} marker={marker} />
                  );
                })}
            {isLoading
              ? null
              : trip.pointsOfInterest.map((marker, index) => {
                  return (
                    <PointAnnotation
                      key={"point-of-interest-" + index}
                      id={"point-of-interest-" + index}
                      coordinate={[
                        marker.location.longitude,
                        marker.location.latitude,
                      ]}
                      onSelected={() => {
                        let initialMarkerSelectedState = isMarkerSelected;
                        let markerIsTheSame =
                          JSON.stringify(markerSelected) ===
                          JSON.stringify(marker);
                        if (!initialMarkerSelectedState) {
                          startAnimation(true);
                        }
                        if (!markerIsTheSame) {
                          setIsMarkerSelected(true);
                          setMarkerSelected(marker);
                          setMarkerSelectedType("pointOfInterest");
                        } else {
                          startAnimation(!initialMarkerSelectedState);
                        }
                      }}
                    />
                  );
                })}
            <ShapeSource id='route-source' shape={geoJsonFeature}>
              <LineLayer
                id='route-layer'
                style={{
                  lineColor: "steelblue",
                  lineWidth: 4,
                  lineJoin: "round",
                  lineCap: "round",
                }}
                layerIndex={100}
              />
            </ShapeSource>
          </MapView>
          <TravelMenu navigation={navigation} />
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
                  markerSelected.description +
                  "\nLongitude : " +
                  markerSelected.location.longitude +
                  "\nLatitude : " +
                  markerSelected.location.latitude
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
  menuButton: {
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

export { getWindowSize, MapScreen };
