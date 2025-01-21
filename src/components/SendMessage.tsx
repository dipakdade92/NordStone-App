import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {hp, wp} from '../utils/responsive';
import Colors from '../utils/colors';
import {firebaseConfig} from '../config/firebaseConfig';
import {initializeApp} from 'firebase/app';
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
} from 'firebase/firestore/lite';
import Constant from '../utils/constant';

const SendMessage = () => {
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    try {
      const messagesCollection = collection(db, 'messages');
      const messagesQuery = query(messagesCollection);
      const querySnapshot = await getDocs(messagesQuery);
      const messages: any = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessageList(messages);

      return messages;
    } catch (error) {
      console.error('Error fetching messages from Firestore:', error);
    }
    setLoading(false);
  };

  const handleSaveTextMessage = async () => {
      setLoading(true);

      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      try {
        const messagesCollection = collection(db, 'messages');

        await addDoc(messagesCollection, {
          text: message,
        });

        fetchMessages();
        setMessage('');
      } catch (error) {
        console.error('Error saving message to Firestore:', error);
        setLoading(false);
      }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.inputWrapper}
        value={message}
        onChangeText={setMessage}
        placeholder={'Enter Message'}
      />
      <TouchableOpacity
        onPress={() => {
          handleSaveTextMessage();
        }}
        disabled={message.trim() === ''}
        style={styles.buttonWrapper}>
          {loading ? 
            <ActivityIndicator size="large" color={Colors.White} /> 
          : 
           <Text style={styles.buttonTextWrapper}>{Constant.send}</Text>
          }
      </TouchableOpacity>

      <View style={styles.flatlistMainWrapper}>
        <FlatList
          style={styles.flatlistWrapper}
          data={messageList}
          renderItem={({item, index}: {item: any; index: number}) => {
            return (
              <View style={styles.messageTextWrapper} key={`${item}-${index}`}>
                <Text>{item.text}</Text>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default SendMessage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  mainWrapper: {
    marginTop: wp(10),
  },
  footerBox: {
    width: wp(25),
    height: wp(15),
    borderWidth: 1,
    borderColor: Colors.Black,
    justifyContent: 'center',
  },
  footerBoxContainer: {
    alignSelf: 'center',
  },
  messageTextWrapper: {
    width: wp(90),
    justifyContent: 'center',
    height: wp(10),
    alignSelf: 'center',
  },
  flatlistMainWrapper: {
    marginTop: wp(5),
    width: wp(100),
    height: hp(65),
  },
  flatlistWrapper: {
    width: wp(100),
    marginTop: wp(10),
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
