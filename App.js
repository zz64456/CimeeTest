import React, { Component } from "react";
import { ScrollView, Text, SafeAreaView, View, StyleSheet, } from "react-native";

// import RNSensorView from "./RNSensorView";
// import GeolocationView from "./GeolocationView"
import Async from "./AsyncStorage"
// import Test from "./Test"


import SensorView from "./SensorView";
import Geolocation from '@react-native-community/geolocation';
import * as Sensors from "react-native-sensors";
import { map, filter } from "rxjs/operators";


// ************************ SensorView


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
      // alt: '',
    };
  }

  // ************************ Async

  writeFile(p) {
    var RNFS = require('react-native-fs');

    // create a path you want to write to
    // :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
    // but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
    var path = RNFS.DocumentDirectoryPath + '/t2.txt';

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
  


  // ************************ Geolocation

  // watchID: ? number = null;

  componentDidMount() {


    


    // this.watchID = Geolocation.watchPosition(position => {

    //   const lastPosition = JSON.stringify(position);
    //   // const alt = JSON.stringify(position.coords.altitude);
    //   console.log(position.timestamp+'    YEAH!!!');
    //   this.setState({lastPosition})
    //   // this.setState({alt, altAccu, lat, acc, long, heading, speed, timestamp})
    //   },
    //   error => Alert.alert('Error', JSON.stringify(error)),
    //   {enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 0},
    // );

    setInterval( this.toAsync, 1000)
  }

  componentWillUnmount() {
    this.watchID != null && Geolocation.clearWatch(this.watchID);
  }

  

  // 整理 SensorView & Geolocation 後輸出至AsyncStorage
  toAsync() {

    Geolocation.getCurrentPosition(
      position => {
        // 寫入
        // this.writeFile(position);
        const initialPosition = JSON.stringify(position);
        console.log("I'm here"+initialPosition)
        this.setState({initialPosition});
      },
      error => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );

    
    // Sensors.setUpdateIntervalForType(Sensors.SensorTypes.accelerometer, 200);
    // Sensors.setUpdateIntervalForType(Sensors.SensorTypes.gyroscope, 200);
    // Sensors.setUpdateIntervalForType(Sensors.SensorTypes.magnetometer, 200);
    // Sensors.setUpdateIntervalForType(Sensors.SensorTypes.barometer, 10000000);

    // const subscriptionAcc = Sensors.accelerometer.subscribe(({ x, y, z, timestamp }) =>
    // console.log({ x, y, z, timestamp }));
    // const subscriptionGyro = Sensors.gyroscope.subscribe(({ x, y, z, timestamp }) =>
    // console.log({ x, y, z, timestamp }));
    // const subscriptionMag = Sensors.magnetometer.subscribe(({ x, y, z, timestamp }) =>
    // console.log({ x, y, z, timestamp }));

    // Sensors.setUpdateIntervalForType(Sensors.SensorTypes.barometer, 400);


    // const subscriptionBar = Sensors.barometer.subscribe(({ pressure}) =>
    // console.log({ pressure }));


    // const subscription = Sensors.accelerometer
    //   .pipe(map(({ x, y, z }) => x + y + z), filter(speed => speed > 0))
    //   .subscribe(
    //     speed => console.log(`You moved your phone with ${speed}`),
    //     error => {
    //       console.log("The sensor is not available");
    //     }
    //   );

    // setTimeout(() => {
    //   console.log('Stopped')
    //   // If it's the last subscription to accelerometer it will stop polling in the native API
    //   subscriptionBar.unsubscribe();
    // }, 10000);
  }







  render() {
    return (
      <SafeAreaView>
        <ScrollView>
          <View style={styles.main}>
            {/* <Test num="10000" /> */}
            {/* <Async alt={this.state.alt} /> */}
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
              {/* <Text>!@#$%^{this.state.alt}-----</Text> */}
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
  },
  // SensorView
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#cafcde",
    marginTop: 10,
    marginBottom: 10
  },
  headline: {
    fontSize: 30,
    textAlign: "left",
    margin: 10
  },
  valueContainer: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  valueValue: {
    width: 200,
    fontSize: 20
  },
  valueName: {
    width: 50,
    fontSize: 20,
    fontWeight: "bold"
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
})
