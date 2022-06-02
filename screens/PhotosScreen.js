import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Pressable, FlatList, Image, Modal, Alert } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import RNFetchBlob from "rn-fetch-blob";
import { useTrip } from "../context/tripContext";
import { useQuery, useQueryClient } from 'react-query';
import checkStatus from "../utils/checkStatus";

function PhotosScreen({navigation, route}) {
    const numColumns = 3;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(null);
    const [currentImageName, setCurrentImageName] = useState(null);
    const trip = useTrip();
    const { isLoading, isError, error, data: photos } = useQuery(['tripPictures', trip.id], () => getPhotos(trip.pictures));
    
    const getPhotos = tripPictures => {
        let pictures = [];
        tripPictures.map((picture, index) => {
            pictures.push({id: index, url: `http://vm-26.iutrs.unistra.fr/api/pictures/file/${picture.id}`, name: picture.filePath});
        })
        return pictures;
    }

    function openModal(index, name) {
        setIsModalOpen(true);
        setCurrentImageIndex(index);
        setCurrentImageName(name);
    }

    const PhotosListItem = ({ item: photo }) => {
        return (
            <Pressable onPress={() => {openModal(photo.id, photo.name)}}>
                <Image source={{uri: photo.url}} style={styles.photo}></Image>
            </Pressable>
        );
    }

    const saveImage = (uri) => {
        let imgExt = currentImageName.substring(currentImageName.lastIndexOf('.'));
        let path = RNFetchBlob.fs.dirs.DCIMDir + '/' + currentImageName;

        RNFetchBlob.config({
            fileCache: true,
            appendExt: imgExt,
            indicator: true,
            path: path,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: path,
                description: 'Image'
            },

        }).fetch("GET", uri).then(res => { 
            Alert.alert(
                "Succès",
                "La photo a bien été ajouté a vos téléchargement.",
                [
                    {
                        text: "OK",
                        onPress: () => {  },
                    },
                ]
            );
        }).catch(error => {
            Alert.alert(
                "Echec",
                "Une erreur a eu lieu lors de la sauvegarde de la photo.",
                [
                    {
                        text: "OK",
                        onPress: () => {  },
                    },
                ]
            );
        });
    };

    return <>
        <View style={styles.mainContainer}>
            <View style={styles.photosListContainer}>
                {isLoading ? <Text style={styles.text}>Loading...</Text> : 
                    photos.length > 0 ?
                    <FlatList
                        data={photos}
                        renderItem={PhotosListItem}
                        keyExtractor={item => item.id}
                        numColumns={numColumns}
                    /> 
                    //  <Text style={styles.text}>Y a une photo normalement</Text>
                    : 
                    <Text style={styles.text}>Aucune photo n'est associée à ce voyage.</Text>
                }
            </View>
            <View style={styles.buttonContainer}>
                <Pressable onPress={() => navigation.navigate('Camera')} style={styles.button}>
                    <Text style={styles.buttonText}>
                        Prendre une photo
                    </Text>
                </Pressable>
            </View>
        </View>
        <Modal visible={isModalOpen} transparent={true} animationType="fade" onRequestClose={() => setIsModalOpen(false)}>
            <View style={styles.modalHeader}>
                <Pressable onPress={() => setIsModalOpen(false)}>
                    <Text style={styles.modalHeaderCloseText}>X</Text>
                </Pressable>
            </View>
            <ImageViewer imageUrls={photos} index={currentImageIndex} onSave={uri => saveImage(uri)} menuContext={{saveToLocal: 'Sauvegarder l\'image dans vos téléchargements', cancel: 'Annuler'}}/>
        </Modal>
    </>;
}

const styles = StyleSheet.create({
    modalHeader: {
        flexDirection: "row",
        backgroundColor : 'black',
        width: '100%',
        justifyContent: 'flex-end',
    },
    modalHeaderCloseText: {
        textAlign: "center",
        marginRight: 20,
        color: 'white',
        fontSize: 25,
    },
    mainContainer: {
        flex: 1, 
        backgroundColor: '#fff', 
        justifyContent: 'space-between', 
        alignItems: 'center'
    },
    photosListContainer: {
        display: 'flex',
        flexDirection: 'row',
        margin: 10,
        marginLeft: 15,
        overflow: 'scroll',
        maxHeight: '85%',
    },
    buttonContainer: {
        width: '100%',
        height: '15%',
        backgroundColor: '#9AC4F8',
        alignItems: 'center', 
    },
    button: {
        width: 130, 
        borderRadius: 4, 
        backgroundColor: '#14274e', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 40,
        marginTop: 20
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold', 
        textAlign: 'center'
    },
    photo: {
        resizeMode: 'cover',
        height: 150,
        width: 100,
        margin: 5,
    }
});

export default PhotosScreen;