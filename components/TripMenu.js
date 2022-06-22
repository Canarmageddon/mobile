import React, { useRef, useState } from "react";
import { Animated, View, TouchableOpacity, Modal, Text } from "react-native";
import { AntDesign, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useUserUpdate } from "../context/userContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

const TripMenu = ({ navigation }) => {
  const slideAnim1 = useRef(new Animated.Value(0)).current;
  const slideAnim2 = useRef(new Animated.Value(0)).current;
  const slideAnim3 = useRef(new Animated.Value(0)).current;
  const slideAnim4 = useRef(new Animated.Value(0)).current;
  const slideAnim5 = useRef(new Animated.Value(0)).current;
  const slideAnim6 = useRef(new Animated.Value(0)).current;
  const slideAnim7 = useRef(new Animated.Value(0)).current;
  const [isMenuSpread, setIsMenuSpread] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const AnimatedPressable = Animated.createAnimatedComponent(TouchableOpacity);
  const userUpdate = useUserUpdate();

  const startAnimation = () => {
    setIsMenuSpread(!isMenuSpread);

    Animated.timing(slideAnim1, {
      toValue: isMenuSpread ? 0 : 55,
      duration: 200,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim2, {
      toValue: isMenuSpread ? 0 : 110,
      duration: 300,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim3, {
      toValue: isMenuSpread ? 0 : 165,
      duration: 400,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim4, {
      toValue: isMenuSpread ? 0 : 220,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim5, {
      toValue: isMenuSpread ? 0 : 275,
      duration: 600,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim6, {
      toValue: isMenuSpread ? 0 : 330,
      duration: 700,
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim7, {
      toValue: isMenuSpread ? 0 : -55,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  async function deleteRefreshToken(){
    await AsyncStorage.removeItem('@refresh_token');
  }
  
  const styles = {
    slideTop1: {
      transform: [{ translateY: slideAnim1 }],
    },
    slideTop2: {
      transform: [{ translateY: slideAnim2 }],
    },
    slideTop3: {
      transform: [{ translateY: slideAnim3 }],
    },
    slideTop4: {
      transform: [{ translateY: slideAnim4 }],
    },
    slideTop5: {
      transform: [{ translateY: slideAnim5 }],
    },
    slideTop6: {
      transform: [{ translateY: slideAnim6 }],
    },
    slideLeft: {
      transform: [{ translateX: slideAnim7 }],
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
      position: "absolute",
      right: 10,
    },
    menu: {
      position: "absolute",
      right: 10,
      top: 10,
    },
    modalButton: {
      width: '48%',
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: '#2c75ff',
      backgroundColor: '#9AC4F8',
      borderLeftWidth: 2,
      borderTopWidth: 2,
      borderBottomWidth: 4,
      borderRightWidth: 4,
      borderRadius: 5,
      marginBottom: 10,
    }, 
    modalButtonText: {
      color: '#fff', 
      margin: 15
    },
    modalButtonView: {
      margin: 10, 
      width: '95%', 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-evenly'
    }, 
    modalTextView: {
      margin: 10, 
      width: '90%'
    }, 
    modalText: {
      fontSize: 20, 
      marginTop: 5
    }, 
    modalWindow: {
      alignItems: 'center', 
      justifyContent: 'space-between', 
      backgroundColor: '#fff', 
      height: 200, 
      width: '90%', 
      borderRadius: 7, 
      elevation: 10
    },
    modalContainer: {
      flex: 1, 
      backgroundColor: 'rgba(52, 52, 52, 0.8)', 
      alignItems: 'center', 
      justifyContent: 'center'
    }
  };

  return (
    <>
      <View style={styles.menu}>
        <TouchableOpacity
          style={[styles.menuButton, { elevation: 12, zIndex: 12 }]}
          onPress={() => startAnimation()}
        >
          {isMenuSpread ? (
            <AntDesign name='up' size={30} color='black' style={{ top: 3 }} />
          ) : (
            <AntDesign name='down' size={30} color='black' style={{ top: 3 }} />
          )}
        </TouchableOpacity>
        <AnimatedPressable
          style={[
            styles.menuButton,
            styles.slideTop1,
            { elevation: 10, zIndex: 10 },
          ]}
          onPress={() => navigation.navigate("Journal de bord")}
        >
          <AntDesign name='book' size={28} color='black' />
        </AnimatedPressable>
        <AnimatedPressable
          style={[
            styles.menuButton,
            styles.slideTop2,
            { elevation: 9, zIndex: 9 },
          ]}
          onPress={() => navigation.navigate("Gestion des dépenses")}
        >
          <FontAwesome5 name='coins' size={28} color='black' />
        </AnimatedPressable>
        <AnimatedPressable
          style={[
            styles.menuButton,
            styles.slideTop3,
            { elevation: 8, zIndex: 8 },
          ]}
          onPress={() => navigation.navigate("Photos")}
        >
          <MaterialIcons name='photo-camera' size={28} color='black' />
        </AnimatedPressable>
        <AnimatedPressable
          style={[
            styles.menuButton,
            styles.slideTop4,
            { elevation: 7, zIndex: 7 },
          ]}
          onPress={() => navigation.navigate("Informations pratiques")}
        >
          <MaterialIcons name='wb-sunny' size={28} color='black' />
        </AnimatedPressable>
        <AnimatedPressable
          style={[
            styles.menuButton,
            styles.slideTop5,
            { elevation: 6, zIndex: 6 },
          ]}
          onPress={() => navigation.navigate("Membres")}
        >
          <MaterialIcons name='groups' size={28} color='black' />
        </AnimatedPressable>
        <AnimatedPressable
          style={[
            styles.menuButton,
            styles.slideTop6,
            { elevation: 5, zIndex: 5 },
          ]}
          onPress={() => navigation.navigate("Listes des étapes et points d'intérêt")}
        >
          <MaterialIcons name='location-on' size={28} color='black' />
        </AnimatedPressable>
        <AnimatedPressable
          style={[
            styles.menuButton,
            styles.slideLeft,
            { elevation: 5, zIndex: 5, backgroundColor: '#dc3545' },
          ]}
          onPress={() => {
            setShowConfirmationPopup(true);
          }}
        >
          <MaterialIcons name='logout' size={28} color='black' />
        </AnimatedPressable>
      </View>
      <View>
        <Modal visible={showConfirmationPopup} transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={styles.modalWindow}>
              <View style={styles.modalTextView}>
                <Text style={styles.modalText}>Êtes-vous sûr de vouloir vous déconnecter ?</Text>
              </View>
              <View style={styles.modalButtonView}>
                <TouchableOpacity
                  onPress={() => setShowConfirmationPopup(false)}
                  style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    userUpdate[0](null);
                    userUpdate[1](null); 
                    deleteRefreshToken();
                    navigation.navigate("Accueil");
                  }}
                  style={styles.modalButton}>
                  <Text style={styles.modalButtonText}>Confirmer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

// You can then use your `SlideInView` in place of a `View` in your components:
export default TripMenu;
