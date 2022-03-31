import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Pressable, Button} from 'react-native';

function PhotosScreen({navigation, route}) {
    return (
      <View style={{flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
          <Pressable onPress={() => navigation.navigate('Camera')} style={{width: 130, borderRadius: 4, backgroundColor: '#14274e', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 40}}>
              <Text style={{color: '#fff', fontWeight: 'bold', textAlign: 'center'}}>
                  Prendre la photo
              </Text>
          </Pressable>
      </View>
    );
}

const styles = StyleSheet.create({
  
});

export default PhotosScreen;