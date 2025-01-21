import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {wp} from '../utils/responsive';
import Colors from '../utils/colors';
import SendMessage from '../components/SendMessage';
import Calculator from '../components/Calculator';
import UploadProfile from '../components/UploadProfile';
import SendNotification from '../components/SendNotification';
import Assets from '../utils/assets';

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState(1);
  return (
    <SafeAreaView style={styles.container}>
      {selectedTab == 1 && <SendMessage />}
      {selectedTab == 2 && <Calculator />}
      {selectedTab == 3 && <UploadProfile />}
      {selectedTab == 4 && <SendNotification />}
      <View style={styles.footerContainer}>
        <TouchableOpacity
          onPress={() => {
            setSelectedTab(1);
          }}
          style={styles.footerBox}>
          <Image source={Assets.comment} style={styles.imageStyle} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedTab(2);
          }}
          style={styles.footerBox}>
          <Image source={Assets.calculator} style={styles.imageStyle} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedTab(3);
          }}
          style={styles.footerBox}>
          <Image source={Assets.picture} style={styles.imageStyle} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedTab(4);
          }}
          style={styles.footerBox}>
          <Image source={Assets.subscribe} style={styles.imageStyle} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
    justifyContent: 'center',
  },
  mainWrapper: {
    marginTop: wp(10),
  },
  footerBox: {
    width: wp(25),
    height: wp(15),
    borderWidth: 1,
    borderColor: Colors.LightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerBoxContainer: {
    alignSelf: 'center',
  },
  footerContainer: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 0,
    width: wp(100),
    height: wp(15),
    borderWidth: 1,
    borderColor: Colors.Black,
    backgroundColor: Colors.White
  },
  imageStyle: {
    width: wp(8),
    height: wp(8),
  },
});
