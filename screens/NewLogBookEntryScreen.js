import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button, TextInput } from "react-native";
import { StackActions } from "@react-navigation/native";
import { useTrip } from "../context/tripContext";
import { useUser } from "../context/userContext";
import checkStatus from "../utils/checkStatus";
import { useMutation, useQueryClient } from "react-query";
function NewLogBookEntryScreen({ navigation, route }) {
  const sendEntry = ({ content, creator, trip }) =>
    fetch(`http://vm-26.iutrs.unistra.fr/api/log_book_entries/new`, {
      method: "POST",
      headers: {
        accept: "application/ld+json",
        "Content-Type": "application/ld+json",
      },
      body: JSON.stringify({
        content,
        creator,
        trip,
      }),
    }).then((res) => res.json());

  const queryClient = useQueryClient();
  const trip = useTrip();
  const [user, token] = useUser();
  const [textValue, setTextValue] = useState("");
  const mutation = useMutation(sendEntry, {
    onSuccess: (data) => {
      queryClient.setQueryData(`logBook${trip.id}`, (old) => [...old, data]);
      const popAction = StackActions.pop(1);
      navigation.dispatch(popAction);
    },
  });
  const handlePress = () => {
    mutation.mutate({
      content: textValue,
      creator: user.id,
      trip: trip.id,
    });
  };

  return (
    <View style={{ flex: 1 }}>
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
    flex: 1,
  },
});

export default NewLogBookEntryScreen;
