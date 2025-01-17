import firebase from '@react-native-firebase/app';

// Your secondary Firebase project credentials...
const credentials = {
  apiKey: 'AIzaSyDGHINQh5Rs_45Iqwln7FU6AYXYXf15aXk',
  authDomain: 'nordstoneapp-a74b9.firebaseapp.com',
  projectId: 'nordstoneapp-a74b9',
  storageBucket: 'nordstoneapp-a74b9.firebasestorage.app',
  messagingSenderId: '253926571219',
  appId: '1:253926571219:web:189de767734cdfdce0a826',
};
await firebase.initializeApp(credentials);
