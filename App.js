import React, { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator  } from '@react-navigation/bottom-tabs';

import { MapScreen } from './screens/MapScreen';
import DocumentScreen from './screens/DocumentScreen';
import LogbookScreen from './screens/LogbookScreen';
import ExpansesScreen from './screens/ExpansesScreen';

const screenOptionStyle = {
    headerStyle: {
      backgroundColor: "#9AC4F8",
    },
    headerTintColor: "white",
    headerBackTitle: "Back",
    unmountOnBlur: true,
};

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
    useEffect(() => {
      async function prepare() {
        try {
          await SplashScreen.preventAutoHideAsync();
  
          //API connection, etc here
  
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (e) {
          console.warn(e);
        } finally {
          await SplashScreen.hideAsync();
        }
      }
  
      prepare();
    }, []);
  
    return <>
      {/* <QueryClientProvider client={queryClient}> */}
          <NavigationContainer>
            <Stack.Navigator initialRouteName="MapScreen" screenOptions={screenOptionStyle}>
                <Stack.Screen name="MapScreen" component={MapScreen} options={{ headerShown: false }}/>
                <Stack.Screen name="Documents" component={DocumentScreen}/>
                <Stack.Screen name="Gestion des dépenses" component={ExpansesScreen}/>
                <Stack.Screen name="Journal de bord" component={LogbookScreen}/>
            </Stack.Navigator>
          </NavigationContainer>
      {/* </QueryClientProvider> */}
    </>;
}