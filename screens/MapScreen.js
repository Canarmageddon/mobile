// MapScreen.js
import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Image, Pressable, Button, Modal,} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { MapView, MarkerView, ShapeSource, Camera, PointAnnotation, SymbolLayer, VectorSource, LineLayer, Callout } from '../MapBox';
import checkStatus from '../utils/checkStatus';
import { AntDesign } from '@expo/vector-icons'; 
import CustomAlert from '../components/CustomAlert';
import TravelMenu from '../components/TravelMenu';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function getWindowSize(){
  // return "width : " +  windowWidth + ", height : " + windowHeight;
  return "width : 100, height : 50";
}

function MapScreen({navigation}) {

  const [listSteps, setListSteps] = useState([
    {longitude: 15.25, latitude: 66.57, titre: 'alpha', description: 'Quelque part en Norvège'},
    {longitude: 13, latitude: 42.89, titre: 'beta', description: 'Quelque part en Italie'},
    {longitude: 3.92, latitude: 34.2, titre: 'omega', description: 'Quelque part en Algérie'},
    {longitude: 7.751991, latitude: 48.614813, titre: 'Strasbourg', description: 'Strasbourg'},
    {longitude: 2.4, latitude: 48.82, titre: 'Paris', description: 'Paris'},
    {longitude: 5.36978, latitude: 43.296482, titre: 'Marseille', description: 'Marseille'}
  ]);
  const [listPointOfInterest, setListPointOfInterest] = useState([
    {longitude: 15.35, latitude: 66.97, titre: 'Ours polaire', description: 'Quelque part en Norvège'},
    {longitude: 7.66, latitude: 48.53, titre: 'Parc', description: 'Parc'},
    {longitude: 7.80, latitude: 48.75, titre: 'Musée', description: 'Musée'},
    {longitude: 7.59, latitude: 48.63, titre: 'Restaurant', description: 'Restaurant'},
  ]);
  const [travelCoordinate, setTravelCoordinate] = useState([]);
  const [isMarkerSelected, setIsMarkerSelected] = useState(false);
  const [markerSelected, setMarkerSelected] = useState(null);
  const [showDescriptionPopup, setShowDescriptionPopup] = useState(false);
  const blueMarker = require('../assets/blue_marker.png');
  const [isImageCharged, setIsImageCharged] = useState(false);

  // const route = fetch('https://api.mapbox.com/directions/v5/mapbox/driving/7.72583,48.46972;2.35183,48.85658;7.71583,48.48806.json?geometries=polyline&steps=true&overview=full&language=en&access_token=pk.eyJ1IjoiYXNsbmRza3ZucWRvZm1uIiwiYSI6ImNreWJyN3VkZzBpNnUydm4wcnJ5MmdvYm0ifQ.YNwpI3-HgF6nMhdaRRkKBg')
  //   .then(checkStatus)
  //   .then(response => response.json())
  //   .then(data => {
  //       console.log(data['routes'][0].geometry);
  //       // data['routes'][0]['legs'].forEach((leg) => {
  //       //   setTravelCoordinate([...travelCoordinate, leg]);
  //       // });
  //       return data;
  //   })  
  //   .catch(error => {
  //       console.log(error.message);
  //   });

  useEffect(() => {
    let travelCoordinates = [];
    listSteps.map(marker => travelCoordinates.push([marker.longitude, marker.latitude]));
    setTravelCoordinate(travelCoordinates);
  }, []);

  const geoJsonFeature = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: travelCoordinate,
    },
  };

  const CustomMarker = ({index, marker}) => {
    return (
      <PointAnnotation
        id={"step-" + index}
        children={true}
        coordinate={[marker.longitude, marker.latitude]}
        anchor={{x: 0.5, y: 1}}
        onSelected={() => {
          setIsMarkerSelected(JSON.stringify(markerSelected) === JSON.stringify(marker) ? !isMarkerSelected : true); 
          setMarkerSelected(JSON.stringify(markerSelected) === JSON.stringify(marker) ? null : marker);
        }}
        layerIndex={200}
      >
        <Image
          id={"pointCount"+ index}
          source={blueMarker}
          style={{ width: 28, height: 40 }}
          onLoad={() => {
            setIsImageCharged(true);
          }}
        />
      </PointAnnotation>
  )};

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1}}>
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
              centerCoordinate={travelCoordinate[0]}
            />
            {
              listSteps.map((marker, index) => {
                return <CustomMarker key={index} index={index} marker={marker}/>;
              })
            }
            {
              listPointOfInterest.map((marker, index) => {
                return <PointAnnotation
                          key={"point-of-interest-" + index}
                          id={"point-of-interest-" + index}
                          coordinate={[marker.longitude, marker.latitude]}
                          onSelected={() => {
                            setIsMarkerSelected(JSON.stringify(markerSelected) === JSON.stringify(marker) ? !isMarkerSelected : true); 
                            setMarkerSelected(JSON.stringify(markerSelected) === JSON.stringify(marker) ? null : marker);
                          }}
                        />;
              })
            }
            <ShapeSource id="route-source" shape={geoJsonFeature}>
              <LineLayer
                id="route-layer"
                style={{
                  lineColor: 'steelblue',
                  lineWidth: 4,
                  lineJoin: 'round',
                  lineCap: 'round',
                }}              
                layerIndex={100}
              />
            </ShapeSource>
          </MapView>
          <TravelMenu navigation={navigation}/>
          {
            isMarkerSelected && markerSelected ?
            <>
              <View style={styles.markerMenu}>
                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>{markerSelected.titre}</Text>
                  </View>
                  <View style={styles.icon}>
                    <Pressable onPress={() => {setIsMarkerSelected(false); setMarkerSelected(null);}}>
                      <AntDesign name="arrowright" size={36} color="black"/>
                    </Pressable>
                  </View>
                </View>
                <View>
                  <Pressable style={styles.markerMenuButton} onPress={() => {
                    navigation.navigate('Documents', {
                        longitude: markerSelected.longitude,
                        latitude: markerSelected.latitude,
                      });
                    }}>
                    <Text style={styles.buttonText}>Documents</Text>
                  </Pressable>
                </View>
                <View>
                  <Pressable style={styles.markerMenuButton} onPress={() => {setShowDescriptionPopup(true)}}>
                    <Text style={styles.buttonText}>Description</Text>
                  </Pressable>
                </View>
              </View>
              <CustomAlert
                displayMsg={markerSelected.description + '\nLongitude : ' + markerSelected.longitude + '\nLatitude : ' + markerSelected.latitude}
                visibility={showDescriptionPopup}
                dismissAlert={setShowDescriptionPopup}
              />
            </>
            : null
          }
          <StatusBar style="default" />
        </View>
       </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    width: windowWidth,
    height: windowHeight,
    margin: 0
  },
  markerMenu:{
    width: '35%',
    height: '100%',
    backgroundColor: '#87CEFA',
    position: 'absolute',
    right: 0,
    borderWidth: 1,
    borderColor: 'black',
    elevation: 15,
    zIndex: 15
  },
  markerMenuButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '95%',
    height: 50,
    backgroundColor: '#90EE90',
    marginRight: 'auto',
    marginLeft:  'auto',
    marginTop: 10,
    borderColor: 'black',
    borderRadius: 5,
    borderWidth: 1,
  },
  buttonText: {
    margin: 5
  },
  icon: {
    alignItems: 'flex-end',
    display: 'flex',
    marginRight: 3
  },
  titleContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 3
  },
  title: {
    fontWeight: "bold",
    fontSize: 18
  },
  menuButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 50,
    backgroundColor: '#fff',
    marginTop: 5,
    borderColor: 'black',
    borderRadius: 25,
    borderWidth: 1,
  }
});

export {getWindowSize, MapScreen};