import React, {useState} from 'react';
import {View, Image, StyleSheet, TouchableOpacity, Text, PermissionsAndroid, Platform, Alert} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import {wp} from '../utils/responsive';
import Colors from '../utils/colors';
import Constant from '../utils/constant';
import {addDoc, collection, getFirestore} from 'firebase/firestore/lite';
import {firebaseConfig} from '../config/firebaseConfig';
import {initializeApp} from 'firebase/app';

const UploadProfile = () => {
  const [photoUri, setPhotoUri] = useState<any>(null);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission to take pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleImagePick = async (type: 'camera' | 'gallery') => {
    try {
      if (type === 'camera') {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
          Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
          return;
        }
      }

      const options: any = {
        mediaType: 'photo',
        quality: 1,
        saveToPhotos: true, 
      };

      if (type === 'camera') {
        const result = await launchCamera(options);
        if (result.didCancel) {
          console.log('User cancelled camera');
        } else if (result.errorCode) {
          console.log('Camera Error: ', result.errorMessage);
        } else if (result.assets?.[0]?.uri) {
          setPhotoUri(result.assets[0].uri);
          // uploadImage(result.assets[0]);
        }
      } else {
        const result = await launchImageLibrary(options);
        if (result.assets?.[0]?.uri) {
          setPhotoUri(result.assets[0].uri);
          // uploadImage(result.assets[0]);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };


  const uploadImage = async (image: any) => {
    if (!image) return;
    try {
      const {uri, fileName, type} = image;
      const storage = getStorage();
      const storageRef = ref(storage, `images/${fileName}`);
      const response = await fetch(uri);
      const blob = await response.blob();
      const snapshot = await uploadBytes(storageRef, blob, {contentType: type});
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const saveImageURLToFirestore = async (url: string, metadata: any) => {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    try {
      const docRef = await addDoc(collection(db, 'images'), {
        imageUrl: url,
        metadata,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error saving image URL to Firestore:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          handleImagePick('camera');
        }}
        style={styles.buttonWrapper}>
        <Text style={styles.buttonTextWrapper}>{Constant.Camera}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          handleImagePick('gallery');
        }}
        style={styles.buttonWrapper}>
        <Text style={styles.buttonTextWrapper}>{Constant.Gallery}</Text>
      </TouchableOpacity>
      {photoUri && <Image source={{uri: photoUri}} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  image: {
    marginTop: wp(10),
    width: wp(80),
    height: wp(60),
    borderRadius: wp(5),
  },
  buttonWrapper: {
    width: wp(95),
    height: wp(13),
    marginTop: wp(5),
    borderRadius: wp(2),
    backgroundColor: Colors.Black,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  buttonTextWrapper: {
    color: Colors.White,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default UploadProfile;
