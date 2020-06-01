import React, { Component } from "react";
import { ScrollView, Text, SafeAreaView, View, StyleSheet, Button } from "react-native";

// import RNSensorView from "./RNSensorView";
// import GeolocationView from "./GeolocationView"
import Async from "./AsyncStorage"
// import Test from "./Test"


import SensorView from "./SensorView";
import Geolocation from '@react-native-community/geolocation';
import * as Sensors from "react-native-sensors";

// ************************ SensorView

const Value = ({ name, value }) => (
  <View style={styles.valueContainer}>
    <Text style={styles.valueName}>{name}:</Text>
    <Text style={styles.valueValue}>{new String(value).substr(0, 8)}</Text>
  </View>
);

const axis = ["x", "y", "z"];

const availableSensors = {
  accelerometer: axis,
  gyroscope: axis,
  magnetometer: axis,
  barometer: ["pressure"]
};
const viewComponents = Object.entries(availableSensors).map(([name, values]) =>
  SensorView(name, values)
);


export default class App extends Component {

  constructor() {
    super()
    this.state = {
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      alt: '',
      altAccu: '',
      lat: '',
      acc: '',
      long: '',
      heading: '',
      speed: '',
      timestamp: ''
    };
  }

  // ************************ Async

  writeFile(p) {
    var RNFS = require('react-native-fs');

    // create a path you want to write to
    // :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
    // but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
    var path = RNFS.DocumentDirectoryPath + '/t1.txt';

    // console.log('主要bundle目錄-'+RNFS.MainBundlePath);//安卓undefined或報錯
    // console.log('快取目錄-'+RNFS.CachesDirectoryPath);
    console.log('文件目錄-'+RNFS.DocumentDirectoryPath);
    // console.log('臨時目錄ios-'+RNFS.TemporaryDirectoryPath);//null
    // console.log('外部儲存目錄android-'+RNFS.ExternalDirectoryPath);
    // console.log('圖片目錄-',RNFS.PicturesDirectoryPath);


    if(!RNFS.exists(path)) {
      // write the file
      RNFS.writeFile(path, JSON.stringify(p), 'utf8')
      .then((success) => {
        console.log('FILE WRITTEN!~~~~');
      })
      .catch((err) => {
        console.log(err.message);
      });
    }

    // append the content to the file
    RNFS.appendFile(path, JSON.stringify(p), 'utf8')
    .then((success) => {
      console.log('appended....');
    })
    .catch((err) => {
      console.log(err.message);
    })

    
  }
  // require the module

  



  // ************************ Geolocation
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
      this.writeFile(position);
      const lastPosition = JSON.stringify(position);
      // const alt = JSON.stringify(position.coords.altitude);
      // const altAccu = JSON.stringify(position.coords.altitudeAccuracy);
      // const lat = JSON.stringify(position.coords.latitude);
      // const acc = JSON.stringify(position.coords.accuracy);
      // const long = JSON.stringify(position.coords.longitude);
      // const heading = JSON.stringify(position.coords.heading);
      // const speed = JSON.stringify(position.coords.speed);
      // const timestamp = JSON.stringify(position.timestamp);
      console.log(position.timestamp+'    YEAH!!!');
      this.setState({lastPosition})
      // this.setState({alt, altAccu, lat, acc, long, heading, speed, timestamp})
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
      <SafeAreaView>
        <ScrollView>
          <View style={styles.main}>
            {/* <Test num="10000" /> */}
            <Async alt={this.state.alt} />
            {/* <GeolocationView /> */}
            <View style={styles.v1}>
              {/* <Text style={styles.t1}>
                <Text style={styles.title}>Initial position: </Text>
                {this.state.initialPosition}
              </Text> */}
              <Text style={styles.t1}>
                <Text style={styles.title}>Current position: </Text>
                {this.state.lastPosition}
              </Text>
              {/* <Button onPress={() => this.writeFile(this.state.lastPosition)} title='給我寫檔!!!'></Button> */}
              {/* <Text>!@#$%^{this.state.alt}-----</Text>
              <Text>!@#$%^{this.state.altAccu}-----</Text>
              <Text>!@#$%^{this.state.lat}-----</Text>
              <Text>!@#$%^{this.state.acc}-----</Text>
              <Text>!@#$%^{this.state.long}-----</Text>
              <Text>!@#$%^{this.state.heading}-----</Text>
              <Text>!@#$%^{this.state.speed}-----</Text>
              <Text>!@#$%^{this.state.timestamp}-----</Text> */}
            </View>
            {/* <RNSensorView /> */}
            <View style={styles.v1}>
              {viewComponents.map((Comp, index) => <Comp key={index} />)}
            </View>
            
          </View>
          {/* { () => AsyncStorage(123)} */}
          

        </ScrollView>
      </SafeAreaView>
      
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#f8e3fc",
  },
  v1: {
    flex: 1,
    paddingTop: 10
  },
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
})
