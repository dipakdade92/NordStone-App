import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {wp} from '../utils/responsive';
import Colors from '../utils/colors';
import Constant from '../utils/constant';
import axios from 'axios';

const Calculator = () => {
  const [firstValue, setFirstValue] = useState('');
  const [secondValue, setSecondValue] = useState('');
  const [operator, setOperator] = useState('Select Option');
  const [result, setResult] = useState(0);
  const [disable, setDisable] = useState(false);

  const handleCalculate = async () => {
    const operation = getOperator(operator);
    const url = `https://api.mathjs.org/v4/?expr=${firstValue}${operation}${secondValue}`;
    try {
      const response = await axios.get(url);
      setResult(response.data);
    } catch (err) {
      setResult(0);
    }
  };

  const getOperator = (type: string) => {
    switch (type) {
      case 'Addition':
        return '%2B';
      case 'Subtraction':
        return '-';
      case 'Multiplication':
        return '*';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.inputWrapper}
        value={firstValue}
        onChangeText={setFirstValue}
        placeholder={'Enter first value'}
      />
      <TextInput
        style={styles.inputWrapper}
        value={secondValue}
        onChangeText={setSecondValue}
        placeholder={'Enter second value'}
      />

      <TouchableOpacity
        onPress={() => {
          setDisable(!disable);
        }}
        style={styles.optionWrapper}>
        <Text style={styles.optionStyleWrppaer}>{operator}</Text>
      </TouchableOpacity>
      <View>
        {disable && (
          <FlatList
            style={{width: wp(90), alignSelf: 'center'}}
            data={[
              {value: 'Addition'},
              {value: 'Subtraction'},
              {value: 'Multiplication'},
            ]}
            renderItem={({item, index}: {item: any; index: number}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setOperator(item.value);
                    setDisable(!disable);
                  }}
                  style={{
                    width: wp(90),
                    justifyContent: 'center',
                    height: wp(10),
                    alignSelf: 'center',
                  }}>
                  <Text>{item.value}</Text>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
      <TouchableOpacity
        onPress={() => {
          handleCalculate();
        }}
        style={styles.buttonWrapper}>
        <Text style={styles.buttonTextWrapper}>{Constant.Calculate}</Text>
      </TouchableOpacity>
      <Text style={styles.resultWrapper}>{`Result : ${result}`}</Text>
    </SafeAreaView>
  );
};

export default Calculator;

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
  resultWrapper: {
    fontSize: 18,
    marginLeft: wp(5),
    marginTop: wp(5),
    fontWeight: '500',
    color: Colors.Black,
  },
  optionWrapper: {
    marginTop: wp(5),
    width: wp(95),
    height: wp(13),
    borderColor: Colors.DimGray,
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: wp(2),
    justifyContent: 'center',
  },
  optionStyleWrppaer: {
    fontSize: 14,
    color: Colors.GreyColor,
    marginLeft: wp(3),
  },
});
