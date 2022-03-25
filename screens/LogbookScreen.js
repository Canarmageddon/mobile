import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Pressable, Button} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function LogbookScreen({navigation, route}) {
    return (
      <View>
      </View>
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
    borderColor: 'black'
  },
  menuButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '95%',
    height: 50,
    backgroundColor: '#90EE90',
    marginRight: 'auto',
    marginLeft:  'auto',
    marginTop: 10
  },
  buttonText: {
    margin: 5
  },
  icon: {
    alignItems: 'flex-end',
    display: 'flex',
    marginRight: 10,
  }
});

export default LogbookScreen;