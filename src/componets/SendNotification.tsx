import React, {useEffect} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import notifee, {TriggerType, TimestampTrigger} from '@notifee/react-native';
import {wp} from '../utils/responsive';
import Colors from '../utils/colors';
import Constant from '../utils/constant';

const SendNotification = () => {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.error('Notification permission denied');
      }
    }
  };

  const handleSendNotification = async () => {
    try {
      const date = new Date(Date.now() + 1 * 1000); // 5 seconds from now
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: date.getTime(),
      };

      await notifee.createTriggerNotification(
        {
          title: 'Hello!',
          body: 'This is a notification triggered by your app.',
        },
        trigger,
      );
      console.log('Notification scheduled.');
    } catch (err) {
      console.log('Failed to send notification: ' + (err as Error).message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          handleSendNotification();
        }}
        style={styles.buttonWrapper}>
        <Text style={styles.buttonTextWrapper}>
          {Constant.sendNotification}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SendNotification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
    justifyContent: 'center',
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
});
