import React, { Component } from "react";
import { ScrollView, Text, SafeAreaView, View, StyleSheet, Button, TextInput } from "react-native";

import Geolocation from '@react-native-community/geolocation';
import sensors, * as Sensors from "react-native-sensors";
import moment from 'moment'
import Geocoder from 'react-native-geocoding';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

Geocoder.init("AIzaSyBNKl2oWD9Euz0-Nd8NrCcx-yONA9r5qSA");

navigator.geolocation = require('@react-native-community/geolocation');
// navigator.geolocation = require('react-native-geolocation-service');

const GooglePlacesInput = () => {
  return (
    <GooglePlacesAutocomplete
      placeholder='Search'
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      query={{
        key: 'AIzaSyBNKl2oWD9Euz0-Nd8NrCcx-yONA9r5qSA',
        language: 'en',
      }}
      currentLocation={true}
      currentLocationLabel='Current location'
    />
  );
};

export default GooglePlacesInput;




// console.log(moment().format('YYYY-MM-DD HH:mm:ss.SSSS'))


class Fetching extends Component {

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
    var path = RNFS.DocumentDirectoryPath + '/v3.txt';
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
  
  sensorCall() {

    Sensors.setUpdateIntervalForType(Sensors.SensorTypes.accelerometer, 1000);
    Sensors.setUpdateIntervalForType(Sensors.SensorTypes.gyroscope, 1000);
    Sensors.setUpdateIntervalForType(Sensors.SensorTypes.magnetometer, 1000);
    Sensors.setUpdateIntervalForType(Sensors.SensorTypes.barometer, 1000);

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
  }


  // ************************ Geolocation
  componentDidMount() {

    /** Activate sensors fetching */
    // sensorCall()
    
    setInterval( () => this.updateGeolocation(), 10000)
    setInterval( () => this.toAsync(), 1000)
    
  }

  // componentWillUnmount() {
  //   this.watchID != null && Geolocation.clearWatch(this.watchID);
  // }

  getRandomLatLng(latitude, longitude) {
    lat_min = latitude-0.00001;
    lat_max = latitude+0.00001;
    let new_lat = Math.random() * (lat_max - lat_min) + lat_min;
    lng_min = longitude-0.00001;
    lng_max = longitude+0.00001;
    let new_lng = Math.random() * (lng_max - lng_min + 1) + lng_min;

    var n1 = Math.round(Math.random()*100); //獲取100之內的任意一個整數;
    if( n1 < 90 ) {
      return [latitude, longitude];
    } else {
      console.log(new_lat, new_lng);
      return [new_lat, new_lng];
    }
    
  } 

  updateGeolocation() {
    Geolocation.getCurrentPosition(
      position => {
        // console.log(moment().unix())
        position.timestamp = moment().unix();
        console.log(position.coords.latitude, position.coords.longitude)
        let location = this.getRandomLatLng(position.coords.latitude, position.coords.longitude)
        // console.log(location)
        Geocoder.from(position.coords.latitude, position.coords.longitude)
        // Geocoder.from(location)
            .then(json => { 
              // console.log(json);
              var addressComponent = json.results[0].formatted_address;
              this.setState({
                Address: addressComponent
              })
              console.log(addressComponent);
            })

            .catch(error => console.warn(error));
        
        // Geocoder.from(39.5489013,-119.8217853)
        // .then(json => {
        //   var addressComponent = json.results[0].address_components;
        //   this.setState({
        //     Address: addressComponent
        //   })
        //   console.log(addressComponent);
        // })
        // .catch(error => console.warn(error));
      

        // this.setState({
        //   position
        // });

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
      // this.writeFile(data)
      // console.log('running....')
    }
  }

  render() { return null; }

  // render() {
  //   return (
  //     <SafeAreaView>
  //       <View>
  //         <Text>
  //           最近儲存時間...{this.state.lastWriteTime}
  //         </Text>
  //       </View>
  //       {/* <View>
  //         <ShowMap />
  //       </View> */}
        
  //     </SafeAreaView>
      
  //   );
  // }
}

// const styles = StyleSheet.create({
//   savingblock: {
//     flex: 1
//   },
//   savingtime: {
    
//   }
// })
