import { Component } from "react";
import Geolocation from '@react-native-community/geolocation';
import sensors, * as Sensors from "react-native-sensors";
import moment from 'moment'
import Geocoder from 'react-native-geocoding';


Geocoder.init("AIzaSyBNKl2oWD9Euz0-Nd8NrCcx-yONA9r5qSA");

/** real-world implementation */
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// navigator.geolocation = require('@react-native-community/geolocation');
// const GooglePlacesInput = () => {
//   return (
//     <GooglePlacesAutocomplete
//       placeholder='Search'
//       onPress={(data, details = null) => {
//         // 'details' is provided when fetchDetails = true
//         console.log(data, details);
//       }}
//       query={{
//         key: 'AIzaSyBNKl2oWD9Euz0-Nd8NrCcx-yONA9r5qSA',
//         language: 'en',
//       }}
//       currentLocation={true}
//       currentLocationLabel='Current location'
//     />
//   );
// };

// export default GooglePlacesInput;



export default class Fetching extends Component {

  constructor() {
    super()
    this.state = {
      behavior: 'null',
      lastWriteTime: '0'
    }

    this.AnalyzeBehavior=this.AnalyzeBehavior.bind(this);
  }

  // ************************ Record data to device
  writeFile(p) {
    var RNFS = require('react-native-fs');
    var path = RNFS.DocumentDirectoryPath + '/0629-1.json';
    console.log('Hi')
    if(!RNFS.exists(path)) {
    // Write the file
    RNFS.writeFile(path, JSON.stringify(p), 'utf8')
      .then((success) => {
        // console.log('FILE WRITTEN!~~~~');
        console.log(p)
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

    /* Activate sensors fetching */
    this.sensorCall()

    /* Get candidate locations */
    this.readLocations()
    
    this._intervals = [  
    setInterval( () => this.updateGeolocation(), 10000),
    setInterval( () => this.toAsync(), 3000),
    setInterval( () => this.AnalyzeBehavior(), 3000),
    ]
  }

  /** When State Changes */
  // componentDidUpdate(){
    
  // }

  componentWillUnmount() {
    this.watchID != null && Geolocation.clearWatch(this.watchID);
    this._intervals.forEach(i => clearInterval(i))
  }

  /*
    ******************************************************************
    For Demo -> Pass "Archie" geolocation -> Create nearby geolocation
    ******************************************************************
  */

  getRandomLatLng(latitude, longitude) {
    lat_min = latitude-0.00001;
    lat_max = latitude+0.00001;
    let new_lat = Math.random() * (lat_max - lat_min) + lat_min;
    lng_min = longitude-0.00001;
    lng_max = longitude+0.00001;
    let new_lng = Math.random() * (lng_max - lng_min + 1) + lng_min;

    var n1 = Math.round(Math.random()*100);
    // 90% of accurate geolcoation, 10% of inaccurate
    if( n1 < 90 ) {
      return [latitude, longitude];
    } else {
      return [new_lat, new_lng];
    }
    
  } 

  updateGeolocation() {
    Geolocation.getCurrentPosition(
      position => {
        position.timestamp = moment().unix();

        /*
        ******************************************************************
        For Demo -> pass "Archie" geolocation -> create nearby geolocation
        ******************************************************************
        */

        /* Let randomLocation = this.getRandomLatLng(39.5490077,-119.8239203) */
        // Geocoder.from(randomLocation)

        Geocoder.from(position.coords.latitude, position.coords.longitude)
            .then(json => {
              var addressComponent = json.results[0].formatted_address;
              this.setState({
                Address: addressComponent
              })
            })

            .catch(error => console.warn(error));

        this.setState({
          position
        });

      },
      error => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }

  /* Get downloaded geolocation data for Sensory coffee shop */
  readLocations() {
    var RNFS = require('react-native-fs');

    let filePath = RNFS.DocumentDirectoryPath + '/coffeeExample_rankbydistance.json';
    RNFS.readFile(filePath, 'utf8')
        .then((result) => {
            candidateLocations = JSON.parse(result)
            this.setState({candidateLocations})
        })
        .catch((err) => {
            console.log(err.message, err.code);
        });
}

  /* Infer behavior */

  AnalyzeBehavior() {  
    let behavior = 'default'
    if(this.state.candidateLocations.results[0].types.includes('cafe')) {
      if (this.state.acc.x < 0.05 && this.state.acc.x > -0.05 &&
          this.state.acc.y < 0.05 && this.state.acc.y > -0.05) {
            behavior = 'coffee'
        /*this.setState({
          behavior: 'coffee'
        })
        */
      } else {
        //console.log(this.state.acc.x, this.state.acc.y)
        /*this.setState({
          behavior: 'default'
        })*/
      }
      this.setState({ behavior });
      console.log(`AnalyzeBehavior: ${behavior}`)
      this.props.SendResultToShowmap(behavior)
    }
    //this.setState({ behavior });
    //this.props.SendResultToShowmap(behavior)
    // console.log(this.state.behavior)
  }
  

  /* Put data of SensorView & Geolocation together */
  toAsync() {

    var data = {}

    data.acc = this.state.acc
    data.gyro = this.state.gyro
    data.mag = this.state.mag
    data.baro = this.state.baro

    /* Record data in device */
    if(this.state.position) {
      data.position = this.state.position.coords
      data.behavior = this.state.behavior
      // this.writeFile(data)
    }
  }

  render() { return null; }

}