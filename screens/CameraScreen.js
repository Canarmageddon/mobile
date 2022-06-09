import {
    Text,
    View,
    TouchableOpacity,
    ImageBackground
} from "react-native";
import React, {useState, useEffect} from "react";
import {Camera} from 'expo-camera'
import { useQueryClient, useMutation } from 'react-query';
import { useTrip } from "../context/tripContext";
import { useUser } from "../context/userContext";
import checkStatus from "../utils/checkStatus";
import { AntDesign, MaterialIcons } from '@expo/vector-icons'; 
import * as MediaLibrary from 'expo-media-library';

const CameraScreen = ({route, navigation}) => {
    const trip = useTrip();
    const [user, token] = useUser();
    const queryClient = useQueryClient();
    const [startCamera,setStartCamera] = React.useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(false);
    let camera = Camera;

    const __startCamera = async () => {
        const {status} = await Camera.requestCameraPermissionsAsync();
        if(status === 'granted'){
            setStartCamera(true);
        }else{
            Alert.alert("Access denied");
        }
    }

    const __requestMediaAccess = async () => {
        const {status} = await MediaLibrary.requestPermissionsAsync();
        setHasMediaLibraryPermission(status === 'granted');
    }
    
    useEffect(() => {
        __startCamera();
        __requestMediaAccess();
    }, [startCamera]);

    const __takePicture = async () => {
        if (!camera) return
        const photo = await camera.takePictureAsync();
        setPreviewVisible(true);
        setCapturedImage(photo);
    }

    const __savePhoto = async (photo) => {
        if(hasMediaLibraryPermission){
            await MediaLibrary.createAssetAsync(photo.uri)
            .then((res) => {
                // console.log(res);
                addItem.mutate(res);
                navigation.navigate('Photos');
            })
            .catch(error => {
                console.log(error);
            });
        }
        else{
            alert("Vous n'avez pas autorisé l'accès aux médias.");
        }
    }

    const __retakePicture = () => {
        setCapturedImage(null);
        setPreviewVisible(false);
        __startCamera();
    }

    const __goBack = () => {
        navigation.goBack();
    }

    const addItem = useMutation((photo) => route.params.addPhoto(photo), {
        onSuccess: item => queryClient.setQueryData(
            ['tripPictures', trip.id],
            items => [...items, {id: queryClient.getQueryData(['tripPictures', trip.id]).length, url: `http://vm-26.iutrs.unistra.fr/api/pictures/file/${item.id}`, name: item.filePath}]
        )
    });

    const CameraPreview = ({photo, retakePicture, savePhoto}) => {
        return (
            <View style={{backgroundColor: 'transparent', flex: 1, width: '100%', height: '100%'}}>
                <ImageBackground source={{uri: photo && photo.uri}} style={{flex: 1}}>
                    <View style={{flex: 1, flexDirection: 'column', padding: 15, justifyContent: 'flex-end'}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <TouchableOpacity onPress={retakePicture} style={{width: 130, height: 40, alignItems: 'center', borderRadius: 4}}>
                                <Text style={{color: '#fff', fontSize: 20}}>
                                    Reprendre
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => savePhoto(photo)} style={{width: 130, height: 40, alignItems: 'center', borderRadius: 4}}>
                                <Text style={{color: '#fff', fontSize: 20}}>
                                    Sauvegarder
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        )
    }

    return <>
        {startCamera ? (
            previewVisible && capturedImage ? (
            <CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture}/>
            ) : (
            <Camera style={{flex: 1,width:"100%"}} ref={(r) => {camera = r}}>
                <View style={{flex: 1, width: '100%',  backgroundColor: 'transparent', flexDirection: 'row'}}>
                    <View style={{position: 'absolute', bottom: 0, flexDirection: 'row', flex: 1, width: '100%', padding: 20}}>
                        <View style={{alignSelf: 'center', flex: 1  }}>
                            <TouchableOpacity onPress={__goBack} style={{ width: 50, height: 50, bottom: 0, borderRadius: 50, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',}}>
                                <AntDesign name="arrowleft" size={36} color="black"/>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 30, alignItems: 'center'}}>
                            <TouchableOpacity onPress={__takePicture} style={{ width: 70, height: 70, bottom: 0, borderRadius: 50, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',}}>
                                <MaterialIcons name="photo-camera" size={28} color="black"/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Camera>
            )
        ) : (
            <View style={{flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: '#fff', fontWeight: 'bold', textAlign: 'center'}}>
                    Votre appareil n'autorise pas la prise de photo depuis cette application.
                </Text>
            </View>
        )}
    </>
};
  
export default CameraScreen;