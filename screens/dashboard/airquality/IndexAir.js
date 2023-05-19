import React, {} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import {images, icons, COLORS, FONTS, SIZES} from '../../../constants';
import {Card, Button, TextInput} from 'react-native-paper';
import Aqi from './Aqi';
import ReceiveFileHandler from '../../ReceiveFileHandler';

const IndexAir = ({navigation}) => {
    return (
      <View style={styles.container}>
       
        <Aqi />

        <ReceiveFileHandler />

      </View>
    );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  
});

export default IndexAir;
