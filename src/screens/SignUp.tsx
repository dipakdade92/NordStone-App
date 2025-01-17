import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import Colors from '../utils/colors';
import {wp} from '../utils/responsive';
import Constant from '../utils/constant';
import Assets from '../utils/assets';
import {initializeApp} from 'firebase/app';
import {addDoc, collection, getFirestore} from 'firebase/firestore/lite';
import {firebaseConfig} from '../config/firebaseConfig';
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth';

const SignUp = ({navigation}: any) => {
  const auth = getAuth();
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<any>();

  const validate = () => {
    const newErrors: any = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Fullname is required*';
    } else if (fullName.length < 3) {
      newErrors.fullName = 'Fullname must be at least 3 characters';
    }

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

  const handleSignup = async () => {
    const validationErrors: any = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({fullName: '', email: '', password: ''});
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;
      try {
        const usersCollection = collection(db, 'users');
        await addDoc(usersCollection, {
          userName: fullName,
          email: email,
          password: password,
          isActive: true,
        });
        navigation.navigate('dashboard');
      } catch (error) {
        console.error('Error creating user or saving details:', error);
      }
    }
  };

  const handleLogInpNavigation = () => {
    setTimeout(() => {
      navigation.navigate('login');
    }, 200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={Assets.logo} style={styles.feedIconWrapper} />
      <View style={styles.mainWrapper}>
        <TextInput
          style={styles.inputWrapper}
          placeholder={Constant.fullName}
          value={fullName}
          onChangeText={setFullName}
        />
        <Text style={styles.errorStyle}>{errors?.fullName}</Text>
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
      <View style={styles.anAccountWapper}>
        <Text style={styles.doYouHaveAnAccountWapper}>
          {Constant.alreayHaveAnAccount}
          <Text onPress={handleLogInpNavigation} style={styles.signUpText}>
            {Constant.logIn}
          </Text>
        </Text>
      </View>
      <TouchableOpacity onPress={handleSignup} style={styles.buttonWrapper}>
        <Text style={styles.buttonTextWrapper}>{Constant.SignUp}</Text>
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
    letterSpacing: 0.4,
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
});

export default SignUp;
