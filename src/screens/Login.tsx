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
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore/lite';
import {initializeApp} from 'firebase/app';
import {firebaseConfig} from '../config/firebaseConfig';

const AuthScreen = ({navigation}: any) => {
  const [email, setEmail] = useState<string>('bbirla214@gmail.com');
  const [password, setPassword] = useState<string>('Birla21@');
  const [errors, setErrors] = useState<any>();

  const validate = () => {
    const newErrors: any = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required*';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = 'Invalid email address';
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!password) {
      newErrors.password = 'Password is required*';
    } else if (!strongPasswordRegex.test(password)) {
      newErrors.password =
        'Password must be at least 8 characters long, contain one uppercase, one lowercase, one number, and one special character';
    }
    return newErrors;
  };

  async function handleLogin() {
    const validationErrors: any = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({fullName: '', email: '', password: ''});
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);

      try {
        const usersCollection = collection(db, 'users');

        const q = query(
          usersCollection,
          where('email', '==', email),
          where('password', '==', password),
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          navigation.navigate('dashboard');
          return {success: true, user: userDoc.data()};
        } else {
          console.error('Invalid email or password');
          return {success: false, message: 'Invalid email or password'};
        }
      } catch (error) {
        console.error('Error logging in user:', error);
        return {success: false, message: 'Error logging in user'};
      }
    }
  }

  const handleSignUpNavigation = () => {
    navigation.navigate('signup');
  };

  const handleForgotPasssword = () => {
    navigation.navigate('forgot');
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
        <TextInput
          style={styles.inputWrapper}
          placeholder={Constant.Password}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Text style={styles.errorStyle}>{errors?.password}</Text>
      </View>
      <TouchableOpacity onPress={handleLogin} style={styles.buttonWrapper}>
        <Text style={styles.buttonTextWrapper}>{Constant.Login}</Text>
      </TouchableOpacity>
      <Text
        onPress={handleForgotPasssword}
        style={styles.fortgotPasswordWrapper}>
        {Constant.forgotPassword}
      </Text>
      <View style={styles.anAccountWapper}>
        <Text style={styles.doYouHaveAnAccountWapper}>
          {Constant.doYouHaveAnAccount}
          <Text onPress={handleSignUpNavigation} style={styles.signUpText}>
            {Constant.SignUp}
          </Text>
        </Text>
      </View>
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
  signUpText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.Black,
  },
  fortgotPasswordWrapper: {
    marginTop: wp(10),
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: Colors.Black,
  },
});

export default AuthScreen;
