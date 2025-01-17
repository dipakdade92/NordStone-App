import React, {useEffect} from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore/lite';
import {firebaseConfig} from './src/config/firebaseConfig';

const App = () => {
  useEffect(() => {
    firebaseIntialization();
  }, []);

  const firebaseIntialization = async () => {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log('Firebase initialized');
  };

  return <AppNavigator />;
};

export default App;
