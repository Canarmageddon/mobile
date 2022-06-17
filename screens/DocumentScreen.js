import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import RNFetchBlob from "rn-fetch-blob";
import { useQuery } from "react-query";
import checkStatus from "../utils/checkStatus";
import { useUser } from "../context/userContext";

function DocumentScreen({route}) {
  const [user, token] = useUser();
  const item = route.params.item;
  const itemType = route.params.itemType;
  const urlItem = itemType === "step" ? 'steps' : itemType === "poi" ? 'point_of_interests' : itemType === "travel" ? 'travel' : null;
  const { isLoading, isError, error, data: documents } = useQuery(['itemDocuments', item.id], () => getDocuments(item.id));

  const getDocuments = (itemId) => {
    return fetch(`http://vm-26.iutrs.unistra.fr/api/${urlItem}/${itemId}/documents`)
      .then(checkStatus)
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch(error => {
        console.log(error.message);
      });
  };

  const downloadFile = (docId) => {
    alert('Le fichier est en cours de téléchargement.');

    const { config, fs } = RNFetchBlob;
    let fileDir = fs.dirs.DownloadDir; // this is the download directory. You can check the available directories in the wiki.
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
        notification: true,
        path: fileDir + "new_file", // this is the path where your downloaded file will live in
        description: "Downloading file.",
      },
    };
    config(options)
      .fetch(
        "GET",
        "http://vm-26.iutrs.unistra.fr/api/documents/file/" + docId,
        {Authorization: `Bearer ${token}`}
      )
      .then((res) => {
        console.log(res);
        alert('Le fichier a été téléchargé.')
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <ScrollView style={styles.documentListContainer}>
    {
      isLoading ? <Text>Loading...</Text> :
        documents.length > 0 ?
        documents.map((document, index) => {
          return (
            <View key={index} style={styles.document}>
              <TouchableOpacity onPress={() => {downloadFile(document.id)}}>
                <Text style={styles.text}>{document.name}</Text>
              </TouchableOpacity>
            </View>
          );
        }) : 
        <View style={styles.noDocumentView}>
          <Text style={styles.noDocument}>Aucun document associé</Text>
        </View>
    }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  documentListContainer: {
    display: 'flex',
    margin: 5,
    marginTop: 0,
    overflow: 'scroll',
    maxHeight: '78%',
    height: '78%',
  },
  document: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    borderRadius: 1,
    backgroundColor: '#9AC4F8',
    padding: 10,
    justifyContent: 'center',
    borderColor: '#000',
    borderRadius: 5,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 4,
    borderBottomWidth: 4,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 18,
    margin: 5,
    color: '#fff',
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline'
  },
  noDocumentView: {
    alignItems: 'center',
  },
  noDocument: {
    fontSize: 18,
    margin: 5,
    color: 'black',
  }
});

export default DocumentScreen;