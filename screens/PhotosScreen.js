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
    const trip = useTrip();
    const { isLoading, isError, error, data: photosTrip } = useQuery(['tripPictures', trip.id], () => getPhotos(trip.id));
    
    const getPhotos = tripId => {
        // return fetch(`http://vm-26.iutrs.unistra.fr/api/pictures`)
        //     // return fetch(`http://vm-26.iutrs.unistra.fr/api/trips/${tripId}`)
        //     .then(checkStatus)
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log(data["hydra:member"]);
        //         // return data["hydra:member"];
        //         return data["hydra:member"];
        //     })  
        //     .catch(error => {
        //         console.log(error.message);
        //     });
        return [];
    }

    const photos = [
        {id: 0, url: 'https://cdn.futura-sciences.com/buildsv6/images/wide1920/6/5/2/652a7adb1b_98148_01-intro-773.jpg'},
        {id: 1, url: 'https://jardinage.lemonde.fr/images/dossiers/2019-09/mandarin-1-083912.jpg'},
        {id: 2, url: 'https://i.notrefamille.com/1400x787/smart/2017/05/30/337863-original.jpg'},
        {id: 3, url: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Anas_platyrhynchos_male_female_quadrat.jpg'},
        {id: 4, url: 'https://www.fdc73.chasseauvergnerhonealpes.com/wp-content/uploads/sites/7/2018/07/Canard-Colvert.jpg'},
        {id: 5, url: 'https://france3-regions.francetvinfo.fr/image/jipXtvKRj3I8tolpJJUOQXarqFg/600x400/regions/2020/06/09/5edf96c44676e_85059093_2865499316845570_4145397555292798976_o-4646581.jpg'},
        {id: 6, url: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Anas_platyrhynchos_male_female_quadrat.jpg'},
        {id: 7, url: 'https://cdn.futura-sciences.com/buildsv6/images/wide1920/6/5/2/652a7adb1b_98148_01-intro-773.jpg'},
        {id: 8, url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzRXFUhyOk8iWFIMdjnImc4FmySZp5ZQmeUWAHLnH1pVUtGp42BFLOcxYwEE8rqNP_9iI&usqp=CAU'},
        {id: 9, url: 'https://i.notrefamille.com/1400x787/smart/2017/05/30/337863-original.jpg'},
        {id: 10, url: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Anas_platyrhynchos_male_female_quadrat.jpg'},
        {id: 11, url: 'https://www.fdc73.chasseauvergnerhonealpes.com/wp-content/uploads/sites/7/2018/07/Canard-Colvert.jpg'},
    ]

    function openModal(index) {
        setIsModalOpen(true);
        setCurrentImageIndex(index);
    }

    const PhotosListItem = ({ item: photo }) => {
        return (
            <Pressable onPress={() => {openModal(photo.id)}}>
                <Image source={{uri: photo.url}} style={styles.photo}></Image>
            </Pressable>
        );
    }

    const saveImage = (uri) => {
        let lastSlashIndex = uri.lastIndexOf('/');
        let imageName = uri.substring(lastSlashIndex);
        let imgExt = imageName.substring(imageName.lastIndexOf('.'));

        let path = RNFetchBlob.fs.dirs.DownloadDir + imageName;

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
                {/* {isLoading ? <Text style={styles.text}>Loading...</Text> :  */}
                    {/* photos.length > 0 ? */}
                    <FlatList
                        data={photos}
                        renderItem={PhotosListItem}
                        keyExtractor={item => item.id}
                        numColumns={numColumns}
                    /> 
                    {/* // <Text style={styles.text}>Y a une photo normalement</Text>
                    : 
                    <Text style={styles.text}>Aucune photo n'est associée à ce voyage.</Text>
                } */}
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