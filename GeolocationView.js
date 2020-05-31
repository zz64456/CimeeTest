/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

'use strict';

import React from 'react';
import {StyleSheet, Text, View, Alert, SafeAreaView} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export default class GeolocationView extends React.Component<
  {},
  $FlowFixMeState,
> {

  
  state = {
    a: 'unknown',
    initialPosition: 'unknown',
    lastPosition: 'unknown',
  };

  watchID: ? number = null;


  componentDidMount() {
    Geolocation.getCurrentPosition(
      position => {
        const initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
      },
      error => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    this.watchID = Geolocation.watchPosition(position => {
      const lastPosition = JSON.stringify(position);
      const a = JSON.stringify(position.coords.altitude);
      console.log(position.coords.altitude+'    YEAH!!!');
      this.setState({lastPosition})
      this.setState({a})
      },
      error => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 0},
    );
    
  }

  componentWillUnmount() {
    this.watchID != null && Geolocation.clearWatch(this.watchID);
  }

  render() {
    return (
        <View style={styles.v2}>
          <Text style={styles.t1}>
            <Text style={styles.title}>Initial position: </Text>
            {this.state.initialPosition}
          </Text>
          <Text style={styles.t1}>
            <Text style={styles.title}>Current position: </Text>
            {this.state.lastPosition}
          </Text>
          <Text>!@#$%^{this.state.a}</Text>
        </View>
      
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '600',
  },
  v2: {
    padding: 25,
    backgroundColor: '#f5f4df'
  },
  t1: {
    fontSize: 20
  }
});
