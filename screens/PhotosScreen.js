import React, {useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Modal, Alert } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFetchBlob from "rn-fetch-blob";
import { useTrip } from "../context/tripContext";
import { useUser } from "../context/userContext";
import { usePosition } from "../contexts/GeolocationContext";
import { useQuery, useQueryClient, useMutation } from 'react-query';
import checkStatus from "../utils/checkStatus";
import PhotosListItem from '../components/PhotoListItem';

function PhotosScreen({navigation, route}) {
    const [currentPosition, setCurrentPosition] = usePosition();
    const numColumns = 3;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(null);
    const [currentImageName, setCurrentImageName] = useState(null);
    const [user, token] = useUser();
    const trip = useTrip();
    const queryClient = useQueryClient();
    const { isLoading, isError, error, data: photos } = useQuery(['tripPictures', trip.id], () => getPhotos(trip.id));
    const { isLoading: isLoadingAlbum, isError: isErrorAlbum, error: errorAlbum, data: picturesInAlbum } = useQuery(['albumData', trip.id], () => getAlbumPictures(trip.album.id));

    const removeItem = useMutation((photoDatabaseId) => deletePicture(photoDatabaseId), {
        onSuccess: (_, photoDatabaseId) => {
            queryClient.setQueryData(
                ['tripPictures', trip.id],
                items => items = items.filter(i => i.databaseId !== photoDatabaseId)
            );
        }
    });

    const getPhotos = tripId => {
        return fetch(`http://vm-26.iutrs.unistra.fr/api/trips/${tripId}/pictures`)
        .then(checkStatus)
        .then((response) => response.json())
        .then((data) => {
            // console.log(data);
            let pictures = [];
            data.map((picture, index) => {
                pictures.push({id: index, databaseId: picture.id, url: `http://vm-26.iutrs.unistra.fr/api/pictures/file/${picture.id}`, name: picture.filePath});
            })
            return pictures;
        })
        .catch((error) => {
            console.log(error.message);
        });
    }

    const getAlbumPictures = albumID => {
        return fetch(`http://vm-26.iutrs.unistra.fr/api/albums/${albumID}/data`)
        .then(checkStatus)
        .then((response) => response.json())
        .then((data) => {
            data = data.map(picture => {
                return picture.id;
            });
            console.log(data);
            return data;
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
                "La photo a bien été sauvegardée.",
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

    const selectLocalPictures = () => {
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
                    photo.source = 'gallery';
                    queryClient.setQueryData(
                        ['tripPictures', trip.id],
                        items => [...items, {id: picturesListLength, databaseId: null, url: photo.uri, name: photo.fileName}]
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
        form.append('album', null);
        if(photo.source === 'camera'){
            form.append('latitude', currentPosition.latitude);
            form.append('longitude', currentPosition.longitude);    
        }

        return fetch('http://vm-26.iutrs.unistra.fr/api/pictures', {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            },
            body: form
        })
        .then(checkStatus)
        .then(response => response.json())
        .then(data => { 
            console.log(data);
            if(photo.source === 'gallery'){
                queryClient.invalidateQueries(['tripPictures', trip.id]);
            }
            return data;
        })        
        .catch(error => {
            if(error.message === "Expired JWT Token"){
                refreshToken();
                addPhoto(photo);
            }
            else{
                alert("Une erreur a eu lieu lors de l'ajout de la photo sur le serveur.");
            }
            console.log(error);
        });
    }

    const addToTripAlbum = (photo) => {
        if(photo.databaseId == null){
            alert('Veuillez patienter que les informations de la photo en base de données soit récupérées.');
        }
        else if(picturesInAlbum.includes(photos[currentImageIndex].databaseId)){
            alert("La photo fait déjà partie de l'album.");
        }
        else{
            return fetch(`http://vm-26.iutrs.unistra.fr/api/pictures/${photo.databaseId}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({album: trip.album.id})
            })
            .then(checkStatus)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                alert("La photo a été ajoutée à l'album avec succès.");
                queryClient.setQueryData(['albumData', trip.id], [...items, data.id]);
                return data;
            })
            .catch((error) => {
                console.log(error.message);
            });
        }
    }

    const deletePicture = (photoDatabaseId) => {
        if(photoDatabaseId == null){
            alert('Veuillez patienter que les informations de la photo en base de données soit récupérées.');
        }
        else{
            return fetch(`http://vm-26.iutrs.unistra.fr/api/pictures/${photoDatabaseId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })
            .then(checkStatus)
            .then(() => {
                setIsModalOpen(false);
                return queryClient.getQueryData(['tripPictures', trip.id]);
            })
            .catch((error) => {
                if(error.message === "Expired JWT Token"){
                    refreshToken();
                    deletePicture(photoDatabaseId);
                }
                console.log(error.message);
            });
        }
    }

    return <>
        <View style={styles.mainContainer}>
            <View style={styles.photosListContainer}>
                {isLoading ? <Text style={{textAlign: 'center', fontSize: 20}}>Chargement...</Text> : 
                    photos.length > 0 ?
                    <FlatList
                        data={photos}
                        renderItem={item => <PhotosListItem photo={item} openModal={openModal}/>}
                        keyExtractor={item => item.id}
                        numColumns={numColumns}
                    /> 
                    : 
                    <Text style={{textAlign: 'center', fontSize: 20, flex : 1, flexWrap: 'wrap'}}>Aucune photo n'est associée à ce voyage.</Text>
                }
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Camera', {addPhoto})} style={styles.button}>
                    <Text style={styles.buttonText}>
                        Prendre une photo
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => selectLocalPictures()} style={styles.button}>
                    <Text style={styles.buttonText}>
                        Importer une photo
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
        <Modal visible={isModalOpen} transparent={true} animationType="fade" onRequestClose={() => setIsModalOpen(false)}>
            <ImageViewer 
                imageUrls={photos} 
                index={currentImageIndex}
                onChange={(newIndex) => setCurrentImageIndex(newIndex)}
                renderHeader={() => {
                    return <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                            <Text style={styles.modalHeaderCloseText}>X</Text>
                        </TouchableOpacity>
                    </View>
                }} 
                onSave={uri => saveImage(uri)} 
                menus={({cancel, saveToLocal}) => {
                    return <View style={styles.imageViewerMenu}>
                        <TouchableOpacity style={[styles.imageViewerMenuButton, {marginTop: 0}]} onPress={() => removeItem.mutate(photos[currentImageIndex].databaseId)}>
                            <Text style={styles.imageViewerMenuButtonText}>Supprimer la photo du voyage</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.imageViewerMenuButton, {marginTop: 0}]} onPress={() => addToTripAlbum(photos[currentImageIndex])}>
                            <Text style={styles.imageViewerMenuButtonText}>Ajouter à l'album du voyage</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.imageViewerMenuButton} onPress={() => saveToLocal()}>
                            <Text style={styles.imageViewerMenuButtonText}>Sauvegarder l'image sur votre téléphone</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.imageViewerMenuButton} onPress={() => cancel()}>
                            <Text style={styles.imageViewerMenuButtonText}>Annuler</Text>
                        </TouchableOpacity>
                     </View>
                }}
            />
        </Modal>
    </>;
}

const styles = StyleSheet.create({
    imageViewerMenu: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    imageViewerMenuButton: {
        width: '48.5%',
        backgroundColor: '#9AC4F8',
        borderWidth: 2,
        borderColor: '#2c75ff',
        margin: 2.5,
        marginBottom: 0,
        justifyContent: 'center'
    },
    imageViewerMenuButtonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        margin: 5,
    },
    modalHeader: { 
        position: 'absolute',
        right: 20,
        flexDirection: "row",
        backgroundColor : 'black',
        width: '100%',
        justifyContent: 'flex-end',
        zIndex: 2
    },
    modalHeaderCloseText: {
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
        height: '80%',
        maxHeight: '80%',
    },
    buttonContainer: {
        width: '100%',
        height: '15%',
        maxHeight: '15%',
        minHeight: '15%',
        backgroundColor: '#9AC4F8',
        alignItems: 'center', 
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 2,
        borderTopColor: '#000',
    },
    button: {
        width: 130, 
        borderRadius: 4, 
        backgroundColor: '#14274e', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: 40,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold', 
        textAlign: 'center'
    },
});

export default PhotosScreen;