import {SafeAreaView, StyleSheet, Image} from 'react-native';
import React, {useEffect} from 'react';
import Assets from '../utils/assets';
import {wp} from '../utils/responsive';

const Splash = ({navigation}: any) => {
  useEffect(() => {
    handleLoginNavigation();
  }, []);

  const handleLoginNavigation = () => {
    setTimeout(() => {
      navigation.navigate('login');
    }, 300);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={Assets.logo} style={styles.imageWrapper} />
    </SafeAreaView>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: wp(25),
    height: wp(25),
    resizeMode: 'center',
  },
});
