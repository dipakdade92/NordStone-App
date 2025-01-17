import {Dimensions} from 'react-native';

export const height: number = Dimensions.get('window').height;
export const width: number = Dimensions.get('window').width;

export const wp = (percentage: number) => {
  return (width * percentage) / 100;
};

export const hp = (percentage: number) => {
  return (height * percentage) / 100;
};
