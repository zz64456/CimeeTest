import React, { Component } from "react";
import { ScrollView, Text, SafeAreaView, View, StyleSheet, } from "react-native";

// import RNSensorView from "./RNSensorView";
// import GeolocationView from "./GeolocationView"
// import Async from "./AsyncStorage"
// import Test from "./Test"


// import SensorView from "./SensorView";
// import SensorView2 from "./SensorView2";
import Geolocation from '@react-native-community/geolocation';
import * as Sensors from "react-native-sensors";
import { map, filter } from "rxjs/operators";
import moment from 'moment'



Sensors.setUpdateIntervalForType(Sensors.SensorTypes.accelerometer, 1000);
Sensors.setUpdateIntervalForType(Sensors.SensorTypes.gyroscope, 1000);
Sensors.setUpdateIntervalForType(Sensors.SensorTypes.magnetometer, 1000);
Sensors.setUpdateIntervalForType(Sensors.SensorTypes.barometer, 1000);

console.log(moment().format('YYYY-MM-DD HH:mm:ss.SSSS'))

// ************************ SensorView


// const axis = ["x", "y", "z"];

// const availableSensors = {
//   accelerometer: axis,
//   gyroscope: axis,
//   magnetometer: axis,
//   barometer: ["pressure"]
// };
// const viewComponents = Object.entries(availableSensors).map(([name, values]) =>
//   SensorView(name, values)
// );


export default class App extends Component {


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

    // create a path you want to write to
    // :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
    // but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
    var path = RNFS.DocumentDirectoryPath + '/v1.txt';

    // console.log('主要bundle目錄-'+RNFS.MainBundlePath);//安卓undefined或報錯
    // console.log('快取目錄-'+RNFS.CachesDirectoryPath);
    // console.log('文件目錄-'+RNFS.DocumentDirectoryPath);
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

    this.setState({
      lastWriteTime: time = moment().format('YYYY-MM-DD HH:mm:ss.SSSS')
    })
  }
  


  // ************************ Geolocation


  componentDidMount() {

    // const o = copy(this.state)
    // o.acc = 42
    // this.setState(o)

    // this.setState({
    //   ...this.state,
    //   acc : 42
    // })
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

    // setInterval( () => this.printingStar(), 1000 )


    setInterval( () => this.toAsync(), 1000)
    
  }


  // componentWillUnmount() {
  //   this.watchID != null && Geolocation.clearWatch(this.watchID);
  // }

  updateGeolocation() {
    // console.log('Now In Geolocation')
    Geolocation.getCurrentPosition(
      position => {
        // console.log("I'm here..   "+position)
        console.log(moment().unix())
        position.timestamp = moment().unix();
        this.setState({
          position
        });
        // console.log('success?', JSON.stringify(this.state.position))
      },
      error => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }

  

  // 整理 SensorView & Geolocation 後輸出至AsyncStorage
  toAsync() {
    // console.log('Now In toAsync')
    var data = {}

    data.acc = this.state.acc
    data.gyro = this.state.gyro
    data.mag = this.state.mag
    data.baro = this.state.baro

    // console.log(".........."+this.state.initialPosition)
    // console.log(`position: ${this.state.position}`)
    if(this.state.position) {
      data.pos = this.state.position.coords
      // console.log(JSON.stringify(data))
      data.behavior = this.state.behavior
      this.writeFile(data)

    }

  }



  render() {
    return (
      <SafeAreaView style={styles.sav}>
        <ScrollView>
          <View style={styles.main}>
            <View style={styles.v1}>
              <Text style={styles.t1}>
                最近儲存時間...{this.state.lastWriteTime}
              </Text>
            </View>
          </View>
          

        </ScrollView>
      </SafeAreaView>
      
    );
  }
}

const styles = StyleSheet.create({
  sav: {
    // flex: 1
    // backgroundColor: ''
  },
  main: {
    // flex: 1,
    // alignItems: 'center',
    
    backgroundColor: "#f8e3fc",
  },
  v1: {
    // justifyContent: 'flex-end',
    // flex: 1,
    alignSelf: 'center',
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
