import React, { useRef, useEffect, useState } from "react";
import { Animated, Text, View, Pressable } from "react-native";
import { AntDesign, FontAwesome5, MaterialIcons } from "@expo/vector-icons";

const TravelMenu = (props) => {
  const slideAnim1 = useRef(new Animated.Value(0)).current;
  const slideAnim2 = useRef(new Animated.Value(0)).current;
  const slideAnim3 = useRef(new Animated.Value(0)).current;
  const slideAnim4 = useRef(new Animated.Value(0)).current;
  const [isMenuSpread, setIsMenuSpread] = useState(false);
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
  };

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
  };

  return (
    <>
      <View style={styles.menu}>
        <Pressable
          style={[styles.menuButton, { elevation: 12, zIndex: 12 }]}
          onPress={() => startAnimation()}
        >
          {isMenuSpread ? (
            <AntDesign name='up' size={30} color='black' style={{ top: 3 }} />
          ) : (
            <AntDesign name='down' size={30} color='black' style={{ top: 3 }} />
          )}
        </Pressable>
        <AnimatedPressable
          style={[
            styles.menuButton,
            styles.slideTop1,
            { elevation: 10, zIndex: 10 },
          ]}
          onPress={() => props.navigation.navigate("Journal de bord")}
        >
          <AntDesign name='book' size={28} color='black' />
        </AnimatedPressable>
        <AnimatedPressable
          style={[
            styles.menuButton,
            styles.slideTop2,
            { elevation: 8, zIndex: 8 },
          ]}
          onPress={() => props.navigation.navigate("Gestion des dépenses")}
        >
          <FontAwesome5 name='coins' size={28} color='black' />
        </AnimatedPressable>
        <AnimatedPressable
          style={[
            styles.menuButton,
            styles.slideTop3,
            { elevation: 6, zIndex: 6 },
          ]}
          onPress={() => props.navigation.navigate("Photos")}
        >
          <MaterialIcons name='photo-camera' size={28} color='black' />
        </AnimatedPressable>
        <AnimatedPressable
          style={[
            styles.menuButton,
            styles.slideTop4,
            { elevation: 4, zIndex: 4 },
          ]}
          onPress={() => props.navigation.navigate("Informations pratiques")}
        >
          <FontAwesome5 name='info' size={28} color='black' />
        </AnimatedPressable>
      </View>
    </>
  );
};

// You can then use your `SlideInView` in place of a `View` in your components:
export default TravelMenu;
