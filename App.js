// App.js
import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MapView from './MapView';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, marginBottom: 10, fontWeight: '600' }}>Behold, a map ! ✨</Text>
      <MapView
        style={{
          height: 300,
          width: 300,
          borderRadius: 20,
          overflow: 'hidden',
        }}
      />
      <StatusBar style="default" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});