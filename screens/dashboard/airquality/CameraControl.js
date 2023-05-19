import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  ToastAndroid,
  Pressable
} from 'react-native';
import {Card, Button, TextInput} from 'react-native-paper';

import {images, icons, COLORS, FONTS, SIZES} from '../../../constants';
import BottomSheet from 'react-native-gesture-bottom-sheet';
import sendDataMobile from '../../../util/getPost'

const IconLabel = ({icon, label}) => {
    return (
      <View style={{alignItems: 'center'}}>
        <Image
          source={icon}
          resizeMode="cover"
          style={{
            width: 50,
            height: 50,
          }}
        />
        <Text style={{marginTop: SIZES.padding, color: COLORS.gray, ...FONTS.h3}}>
          {label}
        </Text>
      </View>
    );
  };

const CameraControl = ({data}) => {
    const bottomSheet = useRef();
    
    return (
    
    <TouchableOpacity onPress={() => console.warn("Still in development")}>
        <IconLabel icon={icons.cameraIcon} label="Control" />
    </TouchableOpacity>
 
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  
});

export default CameraControl;
