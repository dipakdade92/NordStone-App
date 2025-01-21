import React, {useEffect} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import notifee, {TriggerType, TimestampTrigger, AndroidImportance} from '@notifee/react-native';
import {wp} from '../utils/responsive';
import Colors from '../utils/colors';
import Constant from '../utils/constant';

const SendNotification = () => {
  useEffect(() => {
    requestNotificationPermission();
    createNotificationChannel();
  }, []);

  const createNotificationChannel = async () => {
    try {
      await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    } catch (error) {
      console.log('Error creating channel:', error);
    }
  };

  const requestNotificationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.error('Notification permission denied');
          }
        }
        
        // Enable foreground service (optional but recommended)
        await notifee.requestPermission();
      }
    } catch (error) {
      console.log('Permission request error:', error);
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
          android: {
            channelId: 'default', 
            importance: AndroidImportance.HIGH,
          },
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
    width: wp(50),
    height: wp(50),
    borderRadius: wp(25),
    backgroundColor: Colors.Black,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 4,
    borderColor: Colors.GreyColor,

    elevation: 8,
    
    shadowColor: Colors.DarkGray,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.9,
    shadowRadius: 4.65,
  },
  buttonTextWrapper: {
    color: Colors.White,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
