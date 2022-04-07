import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    ImageBackground
} from "react-native";
import React, {useState, useEffect} from "react";
import {Camera} from 'expo-camera'
// import { useQueryClient, useMutation } from 'react-query';
import checkStatus from "../utils/checkStatus";
import { AntDesign, FontAwesome5, MaterialIcons } from '@expo/vector-icons'; 

const CameraScreen = ({route, navigation}) => {
    const [startCamera,setStartCamera] = React.useState(false)
    const [previewVisible, setPreviewVisible] = useState(false)
    const [capturedImage, setCapturedImage] = useState(null)
    let camera = Camera;

    const __startCamera = async () => {
        const {status} = await Camera.requestCameraPermissionsAsync();
        if(status === 'granted'){
            setStartCamera(true);
        }else{
            Alert.alert("Access denied");
        }
    }
    
    useEffect(() => {
        __startCamera();
    }, [startCamera]);

    const __takePicture = async () => {
        if (!camera) return
        const photo = await camera.takePictureAsync();
        setPreviewVisible(true);
        setCapturedImage(photo);
    }

    const __savePhoto = () => {
        // addItem.mutate({photoId: route.params.photo.id, userId: route.params.user.id})
    }

    const __retakePicture = () => {
        setCapturedImage(null);
        setPreviewVisible(false);
        __startCamera();
    }

    const __goBack = () => {
        navigation.goBack();
    }

    // const addItem = useMutation(({photoId, userId}) => createPhoto(photoId, userId), {
    //     onSuccess: item => queryClient.setQueryData(
    //         ['colocPhotosEntities', coloc.id],
    //         items => [...items, item]
    //     )
    // });

    // const createPhoto = (photoId, userId) => {
    //     return fetch('http://sterne.iutrs.unistra.fr:8080/api/coloc/newPhoto', {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({idPhoto: photoId, creator: userId})
    //     })
    //     .then(checkStatus)
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log(data);
    //         navigation.navigate('Liste Photos');
    //         return data;
    //     })        
    //     .catch(error => {
    //         alert(error.message);
    //         console.log(error.message);
    //     });
    // }

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
                            <TouchableOpacity onPress={savePhoto} style={{width: 130, height: 40, alignItems: 'center', borderRadius: 4}}>
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

const styles = StyleSheet.create({
    container: {
        margin: 10,
    },
});