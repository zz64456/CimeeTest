import { Component } from "react";
import Geolocation from '@react-native-community/geolocation';
import sensors, * as Sensors from "react-native-sensors";
import moment from 'moment'
import Geocoder from 'react-native-geocoding';
import * as geolib from 'geolib';


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

const DataIn30Secs = []



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
    console.log('Start writing...')
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

    Sensors.setUpdateIntervalForType(Sensors.SensorTypes.accelerometer, 3000);
    Sensors.setUpdateIntervalForType(Sensors.SensorTypes.gyroscope, 3000);
    Sensors.setUpdateIntervalForType(Sensors.SensorTypes.magnetometer, 3000);
    Sensors.setUpdateIntervalForType(Sensors.SensorTypes.barometer, 3000);

    Sensors.accelerometer.subscribe(({ x, y, z }) => {
      timestamp = moment().format('YYYY-MM-DD HH:mm:ss.SSSS')
      this.setState({
          acc: {
            x, y, z, timestamp
          }
      })
      // console.log(this.state.acc.x, this.state.acc.y)
    })
    Sensors.gyroscope.subscribe(({ x, y, z }) => {
      timestamp = moment().format('YYYY-MM-DD HH:mm:ss.SSSS')
      this.setState({
          gyro: {
            x, y, z, timestamp
          }
      })
      // console.log(this.state.gyro.x, this.state.gyro.y)
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
    console.log('DidMount')
    this._intervals = [  
    setInterval( () => this.updateGeolocation(), 3000),
    setInterval( () => this.toAsync(), 3000),
    // setInterval( () => this.AnalyzeBehavior(), 5000),
    ]
  }

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

    let filePath = RNFS.DocumentDirectoryPath + '/ComeTrue.json';
    RNFS.readFile(filePath, 'utf8')
        .then((result) => {
            candidateLocations = JSON.parse(result)
            this.setState({candidateLocations})
            // console.log('name type : ', typeof(this.state.candidateLocations.results[0].name))
        })
        .catch((err) => {
            console.log(err.message, err.code);
        });
}

  /* Infer behavior */

  AnalyzeBehavior() { 
    console.log('------------------------------------------------')
    console.log('Start Inferring...', moment().format('HH:mm:ss.SSSS'))
    console.log(DataIn30Secs)
    let behavior = 'default'
    // if(this.state.candidateLocations.results[0].types.includes('cafe')) {
      if ( Math.abs(this.state.acc.x) > 0.1 && Math.abs(this.state.acc.y) > 0.1 ) {
        console.log('Moving...')
        /**
         * It's probably moving -> Decide which way:  1.Walk  2.Bike  3.Car
         * Need Velocity -> Need Geolocation
         * */ 

        /** Compute the Distance  Unit:meter/30s */
        let lat_LastInDate = DataIn30Secs[(DataIn30Secs.length)-1].position.latitude
        let lng_LastInDate = DataIn30Secs[(DataIn30Secs.length)-1].position.longitude
        let lat_FirstInData = DataIn30Secs[0].position.latitude
        let lng_FirstInData = DataIn30Secs[0].position.longitude
        // console.log(typeof(DataIn30Secs[(DataIn30Secs.length)-1].position.latitude), DataIn30Secs[(DataIn30Secs.length)-1].position.latitude)
        let distance = geolib.getPreciseDistance({
          latitude: lat_LastInDate,
          longitude: lng_LastInDate},{
          latitude: lat_FirstInData,
          longitude: lng_FirstInData})

        // let distance = geolib.getPreciseDistance(
        //   { latitude: 51.5103, longitude: 7.49347 },
        //   { latitude: "51° 31' N", longitude: "7° 28' E" }
        // );
        
        
        console.log('Distance is : ' + distance)
          

        /** The Velocity of the Object is similar to Walking, Running, or Driving */
        if (Math.abs(distance) <= 40) {
          behavior = 'walking'
        } else if (Math.abs(distance) > 40 && Math.abs(distance) <= 140) {
          behavior = 'running'
        } else if (Math.abs(distance) > 140) {
          behavior = 'driving'
        }


        // behavior = 'coffee'
        /*this.setState({
          behavior: 'coffee'
        })
        */
      } else {
        /**
         * It's not moving -> Decide Behavior -> Need Candidate Location
         * Here the model use top 5 results in Candidate Location
         */
        console.log('Not Moving...')


        var shop_name, shop_types = ''

        /** Default: Candidate Location[0] */
        shop_name = this.state.candidateLocations.results[0].name.toLowerCase()
        shop_types = this.state.candidateLocations.results[0].types
        console.log(shop_name, shop_types)

        /**
         * Priority: Food > Bar > Cafe
         * Restaurant || Food
         * */
        if (shop_types.includes('restaurant')) {
          
          if (shop_name.indexOf('sandwich')>0 || shop_name.indexOf('subway')>0) {
            console.log('indexof : ', shop_name.indexOf('sandwich'))
            behavior = 'sandwich'
          }
          if (shop_name.indexOf('pizza')>0) {
            behavior = 'pizza'
          }
          if (shop_name.indexOf('hamburger')>0 || shop_name.indexOf('burger')>0 ||
            shop_name.indexOf('mcdonald')>0 || shop_name.indexOf('shake shack')>0) {
            behavior = 'hamburger'
          }
        }
        else if (shop_types.includes('bar')) {
          behavior = 'bar'
        }
        else if (shop_types.includes('cafe')){
          behavior = 'cafe'
        }





        //console.log(this.state.acc.x, this.state.acc.y)
        /*this.setState({
          behavior: 'default'
        })*/
      }
      this.setState({ behavior });
      console.log(`AnalyzeBehavior: ${behavior}`)
      this.props.SendResultToShowmap(behavior)
    // }
    //this.setState({ behavior });
    //this.props.SendResultToShowmap(behavior)
    // console.log(this.state.behavior)
  }
  

  /* Put data of SensorView & Geolocation together */
  toAsync() {
    console.log('toAsync')
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
      if (DataIn30Secs.length == 10) {
        DataIn30Secs.shift()
      }
      DataIn30Secs.push(data)
    }

    this.AnalyzeBehavior()

  }

  render() { return null; }

}