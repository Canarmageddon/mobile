import React, {useState} from 'react';

import {Modal, Text, View, TouchableOpacity} from 'react-native';

export default function CustomAlert({ displayMsg, visibility, dismissAlert }) {
  return (
    <View>
      <Modal
        visible={visibility}
        transparent={true}
        animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(52, 52, 52, 0.8)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'white',
              minHeight: 200,
              width: '90%',
              borderWidth: 1,
              borderColor: '#fff',
              borderRadius: 7,
              elevation: 10,
            }}>
            <View style={{ margin: 10, width: '95%', minHeight: 100}}>
              <Text style={{fontSize: 18, marginTop: 5}}>{displayMsg}</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => dismissAlert(false)}
              style={{
                height: 50,
                width: '95%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'blue',
                borderColor: '#2c75ff',
                backgroundColor: '#9AC4F8',
                borderLeftWidth: 2,
                borderTopWidth: 2,
                borderBottomWidth: 4,
                borderRightWidth: 4,
                borderRadius: 5,
                bottom: 0,
                marginBottom: 10,
              }}>
              <Text style={{color: 'white', margin: 15}}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}