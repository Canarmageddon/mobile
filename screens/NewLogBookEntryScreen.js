import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Pressable,
  Button,
  TextInput,
} from "react-native";
import { StackActions } from "@react-navigation/native";

// import { useTrip } from "../context/tripContext";
// import { useQuery, useQueryClient } from 'react-query';;

function NewLogBookEntryScreen({ navigation, route }) {
  const [textValue, setTextValue] = useState("");
  const handlePress = () => {
    const popAction = StackActions.pop(1);

    navigation.dispatch(popAction);
  };
  return (
    <View>
      {/* {isLoading ? <Text style={styles.text}>Loading...</Text> : 
                <FlatList
                    data={listeTrip}
                    renderItem={TripListItem}
                    keyExtractor={item => item.id}
                />
            } */}
      <TextInput
        style={styles.input}
        value={textValue}
        onChangeText={(text) => setTextValue(text)}
        multiline={true}
        underlineColorAndroid='transparent'
        placeholder='Ecrivez ici'
      />
      <Button title='Enregistrer' onPress={() => handlePress()} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    alignSelf: "center",
    width: "75%",
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
});

export default NewLogBookEntryScreen;
