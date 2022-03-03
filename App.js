// App.js
import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Image, Pressable, Button} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { MapView, Marker, ShapeSource, Camera, PointAnnotation, SymbolLayer, VectorSource, LineLayer, Callout } from './MapBox';
import checkStatus from './utils/checkStatus';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function getWindowSize(){
  // return "width : " +  windowWidth + ", height : " + windowHeight;
  return "width : 100, height : 50";

}

function App() {

  const [listMarkers, setListeMarkers] = useState([
    {longitude: 8.25, latitude: 49.57},
    {longitude: 8, latitude: 48.89},
    {longitude: 7.92, latitude: 49.2},
    {longitude: 7.751991, latitude: 48.614813},
  ]);

  // const route = fetch('https://api.mapbox.com/directions/v5/mapbox/driving/7.72583,48.46972;2.35183,48.85658;7.71583,48.48806.json?geometries=polyline&steps=true&overview=full&language=en&access_token=pk.eyJ1IjoiYXNsbmRza3ZucWRvZm1uIiwiYSI6ImNreWJyN3VkZzBpNnUydm4wcnJ5MmdvYm0ifQ.YNwpI3-HgF6nMhdaRRkKBg')
  //   .then(checkStatus)
  //   .then(response => response.json())
  //   .then(data => {
  //       console.log(data['routes'][0]['legs']);
  //       return data;
  //   })  
  //   .catch(error => {
  //       console.log(error.message);
  //   });
  const showPopup = () => {

  }

  const CustomMarker = ({index, marker}) => {
    return (
      // DU GROS CACA LÀ
      // <Pressable onPress={() => {showPopup}}>
      //   <Marker key={index} coordinate={[marker.longitude, marker.latitude]} >
      //     <Image
      //       style={{
      //         width: 25,
      //         height: 40,
      //       }}
      //       source={require('./assets/red_marker.png')}
      //     />
      //   </Marker>
      // </Pressable>
      <PointAnnotation
        id={"annotation-hidden-" + index}
        coordinate={[marker.longitude, marker.latitude]}
        style={{backgroundColor: 'white'}}>
          <Callout
            style={{color: 'black', width: 200, height: 'auto', backgroundColor: 'white'}}
          >
            <View style={{margin: 5}}>
              <Text>{"Longitude: " + marker.longitude + "\nLatitude : " + marker.latitude}</Text>
              <Button title="Journal" onPress={() => {alert(marker)}}/>
            </View>
         </Callout>
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
          >
            <Camera
              zoomLevel={5}
              centerCoordinate={[7.751991, 48.614813]}
            />
            {
              listMarkers.map((marker, index) => {
                return <CustomMarker key={index} index={index} marker={marker}/>;
              })
            }
          </MapView>
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
});

export {getWindowSize, App};