import React, { Component } from "react";
import { ScrollView, Text, SafeAreaView, View, StyleSheet, Button, TextInput } from "react-native";

import Geolocation from '@react-native-community/geolocation';
import * as Sensors from "react-native-sensors";
import moment from 'moment'




Sensors.setUpdateIntervalForType(Sensors.SensorTypes.accelerometer, 1000);
Sensors.setUpdateIntervalForType(Sensors.SensorTypes.gyroscope, 1000);
Sensors.setUpdateIntervalForType(Sensors.SensorTypes.magnetometer, 1000);
Sensors.setUpdateIntervalForType(Sensors.SensorTypes.barometer, 1000);

// console.log(moment().format('YYYY-MM-DD HH:mm:ss.SSSS'))


export default class FetchingScreen extends Component {

  constructor() {
    super()
    this.state = {
      behavior: 'null',
      lastWriteTime: '0'
    }
  }

  // ************************ Async

  writeFile(p) {
    var RNFS = require('react-native-fs');
    var path = RNFS.DocumentDirectoryPath + '/v2.txt';
    if(!RNFS.exists(path)) {
    // Write the file
    RNFS.writeFile(path, JSON.stringify(p), 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!~~~~');
      })
      .catch((err) => {
        console.log(err.message);
      });
    }

      // Append the content to the file
    RNFS.appendFile(path, JSON.stringify(p), 'utf8')
      .then((success) => {
        console.log('appended....');
      })
      .catch((err) => {
        console.log(err.message);
    })

    this.setState({
      lastWriteTime: time = moment().format('YYYY-MM-DD HH:mm:ss.SSSS')
    })
  }
  


  // ************************ Geolocation
  componentDidMount() {

    Sensors.accelerometer.subscribe(({ x, y, z }) => {
      timestamp = moment().format('YYYY-MM-DD HH:mm:ss.SSSS')
      this.setState({
          acc: {
            x, y, z, timestamp
          }
      })
    })
    Sensors.gyroscope.subscribe(({ x, y, z }) => {
      timestamp = moment().format('YYYY-MM-DD HH:mm:ss.SSSS')
      this.setState({
          gyro: {
            x, y, z, timestamp
          }
      })
    })
    Sensors.magnetometer.subscribe(({ x, y, z }) => {
      timestamp = moment().format('YYYY-MM-DD HH:mm:ss.SSSS')
      this.setState({
          mag: {
            x, y, z, timestamp
          }
      })
    })
    Sensors.barometer.subscribe(({ pressure }) => {
      timestamp = moment().format('YYYY-MM-DD HH:mm:ss.SSSS')
      this.setState({
          baro: {
            pressure, timestamp
          },
      })
    })
    
    setInterval( () => this.updateGeolocation(), 2000)
    setInterval( () => this.toAsync(), 1000)
    
  }

  // componentWillUnmount() {
  //   this.watchID != null && Geolocation.clearWatch(this.watchID);
  // }

  updateGeolocation() {
    Geolocation.getCurrentPosition(
      position => {
        console.log(moment().unix())
        position.timestamp = moment().unix();
        this.setState({
          position
        });
      },
      error => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }
  

  // 整理 SensorView & Geolocation 後輸出至AsyncStorage
  toAsync() {

    var data = {}

    data.acc = this.state.acc
    data.gyro = this.state.gyro
    data.mag = this.state.mag
    data.baro = this.state.baro

    if(this.state.position) {
      data.pos = this.state.position.coords
      data.behavior = this.state.behavior
      this.writeFile(data)

    }

  }

  render() {
    return (
      <View>
        <Text>
          最近儲存時間...{this.state.lastWriteTime}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  savingblock: {
    flex: 1
  },
  savingtime: {
    
  }
})
