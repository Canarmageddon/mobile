import * as React from 'react';
import { Text, View } from 'react-native';
import Constants from 'expo-constants';

let MapView;
let MarkerView;
let ShapeSource;
let Camera;
let PointAnnotation;
let SymbolLayer;
let VectorSource;
let LineLayer;
let Callout;

if (Constants.appOwnership === 'expo') {
  MapView = props => (
    <View
      style={[
        {
          backgroundColor: 'lightblue',
          alignItems: 'center',
          justifyContent: 'center',
        },
        props.style,
      ]}>
      <Text>🗺 (Mapbox not available)</Text>
    </View>
  );
} else {
  const Mapbox = require('@react-native-mapbox-gl/maps').default;
  Mapbox.setAccessToken('pk.eyJ1IjoiamJoYXJpIiwiYSI6ImNreXlmeWZsYzBqczEydnFrZjZoeDJqMmEifQ.7Z9vGxLMr0cWskUyVAZXZQ');
  MapView = Mapbox.MapView;
  MarkerView = Mapbox.MarkerView;
  ShapeSource = Mapbox.ShapeSource;
  Camera = Mapbox.Camera;
  PointAnnotation = Mapbox.PointAnnotation;
  SymbolLayer = Mapbox.SymbolLayer;
  VectorSource = Mapbox.VectorSource;
  LineLayer = Mapbox.LineLayer;
  Callout = Mapbox.Callout;

}

export {MapView, MarkerView, ShapeSource, Camera, PointAnnotation, SymbolLayer, VectorSource, LineLayer, Callout};