import React, { useRef, useEffect, useState } from "react";
import { Animated, Text, View, Pressable, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
navigator.geolocation = require("@react-native-community/geolocation");

const MarkerMenu = ({
  slideAnim,
  startAnimation,
  navigation,
  markerSelected,
  markerSelectedType,
  setShowDescriptionPopup,
}) => {
  const styles = {
    slide: {
      transform: [{ translateY: slideAnim }],
    },
    menuContainer: {
      width: "100%",
      height: "18%",
      position: "absolute",
      bottom: 0,
      elevation: 15,
      zIndex: 15,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    closeMenu: {
      width: "10%",
      height: "20%",
      borderWidth: 1,
      borderBottomWidth: 0,
      alignItems: "center",
    },
    markerMenu: {
      height: "80%",
      width: "100%",
      borderWidth: 1,
      flexDirection: "column",
    },
    markerMenuButton: {
      width: "100%",
      height: 50,
      backgroundColor: "#90EE90",
      marginRight: "auto",
      marginLeft: "auto",
      marginTop: 10,
      borderColor: "black",
      borderRadius: 5,
      borderWidth: 1,
      display: "flex",
      justifyContent: "center",
    },
    menu: {
      position: "absolute",
      right: 10,
      top: 10,
    },
    titleContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: 5,
    },
    title: {
      fontWeight: "bold",
      fontSize: 17,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      maxHeight: 23,
    },
    buttonText: {
      margin: 5,
      textAlign: "center",
      fontWeight: "bold",
    },
  };

  const menuBackgroundColor =
    markerSelectedType === "step"
      ? "#87CEFA"
      : markerSelectedType === "poi"
      ? "#ff2225"
      : markerSelectedType === "travel"
      ? "#34c924"
      : null;
  const itemTitle =
    markerSelectedType === "step"
      ? markerSelected.description
      : markerSelectedType === "poi"
      ? markerSelected.location.name
      : markerSelectedType === "travel"
      ? `Trajet de ${markerSelected.start.id} à ${markerSelected.end.id}`
      : null;

  return (
    <>
      <Animated.View style={[styles.menuContainer, styles.slide]}>
        <View
          style={[styles.closeMenu, { backgroundColor: menuBackgroundColor }]}
        >
          <Pressable
            onPress={() => {
              startAnimation();
            }}
          >
            <AntDesign name='arrowdown' size={24} color='black' />
          </Pressable>
        </View>
        <View
          style={[styles.markerMenu, { backgroundColor: menuBackgroundColor }]}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{itemTitle}</Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <View style={{ width: "40%" }}>
              <Pressable
                style={styles.markerMenuButton}
                onPress={() => navigation.navigate("Documents")}
              >
                <Text style={styles.buttonText}>Documents</Text>
              </Pressable>
            </View>
            <View style={{ width: "40%" }}>
              <Pressable
                style={styles.markerMenuButton}
                onPress={() => {
                  setShowDescriptionPopup(true);
                }}
              >
                <Text style={styles.buttonText}>Description</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Animated.View>
    </>
  );
};

// You can then use your `SlideInView` in place of a `View` in your components:
export default MarkerMenu;
