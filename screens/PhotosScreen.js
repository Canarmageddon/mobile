import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Pressable, FlatList, Modal, Alert } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFetchBlob from "rn-fetch-blob";
import { useTrip } from "../context/tripContext";
import { useUser } from "../context/userContext";
import { useQuery, useQueryClient } from 'react-query';
import checkStatus from "../utils/checkStatus";
import PhotosListItem from '../components/PhotoListItem';

function PhotosScreen({navigation, route}) {
    const numColumns = 3;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(null);
    const [currentImageName, setCurrentImageName] = useState(null);
    const [user, token] = useUser();
    const trip = useTrip();
    const queryClient = useQueryClient();
    const { isLoading, isError, error, data: photos } = useQuery(['tripPictures', trip.id], () => getPhotos(trip.id));
    
    const getPhotos = tripId => {
        return fetch(`http://vm-26.iutrs.unistra.fr/api/trips/${tripId}/pictures`)
        .then(checkStatus)
        .then((response) => response.json())
        .then((data) => {
            // console.log(data);
            let pictures = [];
            data.map((picture, index) => {
                pictures.push({id: index, url: `http://vm-26.iutrs.unistra.fr/api/pictures/file/${picture.id}`, name: picture.filePath});
            })
            return pictures;
        })
        .catch((error) => {
            console.log(error.message);
        });
    }

    function openModal(index, name) {
        setIsModalOpen(true);
        setCurrentImageIndex(index);
        setCurrentImageName(name);
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
                [{ text: "OK", onPress: () => {} }]
            );
        }).catch(error => {
            Alert.alert(
                "Echec",
                "Une erreur a eu lieu lors de la sauvegarde de la photo.",
                [{ text: "OK", onPress: () => {}}]
            );
        });
    };

    const selectFile = () => {
        var options = {
            mediaType: 'photo',
            selectionLimit: 10,
        };
        launchImageLibrary(options, res => {
            console.log('Response = ', res);
            if (res.didCancel) {
                console.log('User cancelled image picker');
            } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
            } else {
                let source = res.assets;
                let picturesListLength = queryClient.getQueryData(['tripPictures', trip.id]).length;
                source.map(photo => {
                    photo.fileName = photo.fileName.replace('rn_image_picker_lib_temp_', '');
                    queryClient.setQueryData(
                        ['tripPictures', trip.id],
                        items => [...items, {id: picturesListLength, url: photo.uri, name: photo.fileName}]
                    );
                    addPhoto(photo);
                    picturesListLength++;
                })
            }
        });
    };

    const addPhoto = (photo) => {
        const name = photo.filename ?? photo.fileName;
        const form = new FormData();
        const uriParts = name.split('.');
        const type = uriParts[uriParts.length - 1];

        form.append('file', {
            uri: photo.uri,
            type: 'image/' + type,
            name: name,
        });
        form.append('creator', user.id);
        form.append('trip', trip.id);

        return fetch('http://vm-26.iutrs.unistra.fr/api/pictures', {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
            },
            body: form
        })
        .then(checkStatus)
        .then(response => response.json())
        .then(data => { 
            console.log(data);
            return data;
        })        
        .catch(error => {
            alert("Une erreur a eu lieu lors de l'ajout de la photo sur le serveur.");
            console.log(error);
        });
    }

    return <>
        <View style={styles.mainContainer}>
            <View style={styles.photosListContainer}>
                {isLoading ? <Text style={styles.text}>Loading...</Text> : 
                    photos.length > 0 ?
                    <FlatList
                        data={photos}
                        renderItem={item => <PhotosListItem photo={item} openModal={openModal}/>}
                        keyExtractor={item => item.id}
                        numColumns={numColumns}
                    /> 
                    : 
                    <Text style={styles.text}>Aucune photo n'est associée à ce voyage.</Text>
                }
            </View>
            <View style={styles.buttonContainer}>
                <Pressable onPress={() => navigation.navigate('Camera', {addPhoto})} style={styles.button}>
                    <Text style={styles.buttonText}>
                        Prendre une photo
                    </Text>
                </Pressable>
                <Pressable onPress={() => selectFile()} style={styles.button}>
                    <Text style={styles.buttonText}>
                        Importer une photo
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
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        width: 130, 
        borderRadius: 4, 
        backgroundColor: '#14274e', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 40,
        marginTop: -20
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold', 
        textAlign: 'center'
    },
});

export default PhotosScreen;