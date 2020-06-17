import React, { memo } from 'react';
import { Image, StyleSheet } from 'react-native';

const Logo = () => (
  // <Image source={require('../assets/logo.png')} style={styles.image} />
  <Image source={{
    uri: 'https://upload.cc/i1/2020/06/17/iXUof9.png' }} style={{width: 200,
    height: 200,
    marginBottom: 12,}} />
);

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    marginBottom: 12,
  },
});

export default memo(Logo);