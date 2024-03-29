import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { QueryClient, QueryClientProvider } from "react-query";
import MapScreen from "./screens/MapScreen";
import HomeScreen from "./screens/HomeScreen";
import DocumentScreen from "./screens/DocumentScreen";
import LogbookScreen from "./screens/LogbookScreen";
import ExpansesScreen from "./screens/ExpansesScreen";
import AddExpanseScreen from "./screens/AddExpanseScreen";
import PhotosScreen from "./screens/PhotosScreen";
import CameraScreen from "./screens/CameraScreen";
import InformationScreen from "./screens/InformationScreen";
import ConnexionScreen from "./screens/ConnexionScreen";
import TripListScreen from "./screens/TripListScreen";
import DetailEtapes from "./screens/DetailEtapes";
import MembersScreen from "./screens/MembersScreen";
import { PositionProvider } from "./context/GeolocationContext";
import NewLogBookEntryScreen from "./screens/NewLogBookEntryScreen";
import { UserProvider } from "./context/userContext";
import { TripProvider } from "./context/tripContext";

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#9AC4F8",
    borderBottomWidth: 2,
    borderBottomColor: '#000'
  },
  headerTintColor: "white",
  headerBackTitle: "Back",
  unmountOnBlur: true,
};

const Stack = createStackNavigator();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // 5000
    },
  },
});

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

  return (
    <>
      <UserProvider>
        <TripProvider>
          <PositionProvider>
            <QueryClientProvider client={queryClient}>
              <NavigationContainer>
                <Stack.Navigator
                  initialRouteName='Accueil'
                  screenOptions={screenOptionStyle}
                >
                  <Stack.Screen name='Accueil' component={HomeScreen} options={{ headerShown: false }}/>
                  <Stack.Screen name='Connexion' component={ConnexionScreen} />
                  <Stack.Screen name='Mes voyages' component={TripListScreen} />
                  <Stack.Screen
                    name='MapScreen'
                    component={MapScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name='Documents' component={DocumentScreen} />
                  <Stack.Screen name="Listes des étapes et points d'intérêt" component={DetailEtapes} />
                  <Stack.Screen
                    name='Gestion des dépenses'
                    component={ExpansesScreen}
                  />
                  <Stack.Screen
                    name='Ajouter une dépense'
                    component={AddExpanseScreen}
                  />
                  <Stack.Screen
                    name='Journal de bord'
                    component={LogbookScreen}
                  />
                  <Stack.Screen name='Photos' component={PhotosScreen} />
                  <Stack.Screen
                    name='Camera'
                    component={CameraScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name='Informations pratiques'
                    component={InformationScreen}
                  />
                  <Stack.Screen name='Membres' component={MembersScreen} />
                  <Stack.Screen
                    name='Ajouter une entrée au journal'
                    component={NewLogBookEntryScreen}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </QueryClientProvider>
          </PositionProvider>
        </TripProvider>
      </UserProvider>
    </>
  );
}
