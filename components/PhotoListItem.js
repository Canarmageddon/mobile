import React, {useState} from 'react';
import { StyleSheet, View, Pressable, Image, ActivityIndicator } from 'react-native';

const styles = StyleSheet.create({
    photoLoading: {
        height: 150,
        width: 100,
        margin: 5,
        justifyContent: 'center', 
        alignItems: 'center', 
    },
    photo: {
        resizeMode: 'cover',
        height: 150,
        width: 100,
        margin: 5,
    }
});

export default function PhotosListItem({photo, openModal}) {
    const [isLoading, setIsLoading] = useState(true);
    photo = photo.item;
    return (
        <Pressable onPress={() => {openModal(photo.id, photo.name)}}>
            <View style={[styles.photoLoading, {display: isLoading ? "flex" : "none"}]}>
                <ActivityIndicator size="large" color="#0000ff"/> 
            </View>
            <Image
                source={{uri: photo.url}} 
                style={[styles.photo, {display: isLoading ? "none" : "flex"}]} 
                onLoadStart={() => {
                    setIsLoading(true);
                }}
                onLoadEnd={() => {
                    setIsLoading(false);
                }}
            ></Image>
        </Pressable>
    );
}