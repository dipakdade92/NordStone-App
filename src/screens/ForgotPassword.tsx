import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import Assets from '../utils/assets';
import Constant from '../utils/constant';
import {wp} from '../utils/responsive';
import Colors from '../utils/colors';
import {getAuth, sendPasswordResetEmail} from 'firebase/auth';
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore/lite';
import {initializeApp} from 'firebase/app';
import {firebaseConfig} from '../config/firebaseConfig';

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>('');
  const [errors, setErrors] = useState<any>();

  const forgotPassword = async (email: string) => {
    const auth = getAuth();

    try {
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        try {
          await sendPasswordResetEmail(auth, email);
        } catch (error) {
          console.error('Error sending password reset email:', error);
        }
        return true;
      } else {
        setErrors({email: 'Email does not exist.'});
        return false;
      }
    } catch (error) {
      console.error('Error checking user existence:', error);
      return false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={Assets.logo} style={styles.feedIconWrapper} />
      <View style={styles.mainWrapper}>
        <TextInput
          style={styles.inputWrapper}
          placeholder={Constant.Email}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <Text style={styles.errorStyle}>{errors?.email}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          forgotPassword(email);
        }}
        style={styles.buttonWrapper}>
        <Text style={styles.buttonTextWrapper}>{Constant.forgotPassword}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
    justifyContent: 'center',
  },
  mainWrapper: {
    marginTop: wp(10),
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  inputWrapper: {
    borderWidth: 1,
    paddingLeft: wp(3),
    marginTop: wp(4),
    width: wp(94),
    height: wp(14),
    alignSelf: 'center',
    borderRadius: wp(2),
    color: Colors.Black,
    borderColor: Colors.DimGray,
  },
  buttonWrapper: {
    width: wp(95),
    height: wp(13),
    marginTop: wp(25),
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
  feedIconWrapper: {
    width: wp(16),
    height: wp(16),
    alignSelf: 'center',
  },
  errorStyle: {
    fontSize: 16,
    color: Colors.Red,
    marginLeft: wp(5),
    marginTop: wp(1),
    letterSpacing: 0.3,
  },
  anAccountWapper: {
    width: wp(90),
    position: 'absolute',
    bottom: wp(8),
    alignSelf: 'center',
  },
  doYouHaveAnAccountWapper: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.DimGray,
  },
  signUpText: {fontSize: 16, fontWeight: '500', color: Colors.Black},
});

export default ForgotPassword;
