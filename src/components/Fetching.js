import React, { Component } from "react";
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment'
import Geocoder from 'react-native-geocoding';
import sensors, * as Sensors from "react-native-sensors";
import * as geolib from 'geolib';
import {StyleSheet, Modal, View, Text, TextInput, TouchableHighlight, Image} from 'react-native'
import { TouchableOpacity } from "react-native-gesture-handler";
import {behaviors_URIs} from '../bitmoji/bitmoji'



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
var CorrArr = []
var Last_Behavior = ''
var NoIconText = ''
var force = ''
var resting_sec = -1


export default class Fetching extends Component {

  constructor(props) {
    super(props)
    this.state = {
      // behavior: 'default',
      lastWriteTime: '0',
      recordBool: false,
      modalVisible: false
    }

    this.AnalyzeBehavior=this.AnalyzeBehavior.bind(this);
  }

  onChangerecordBool() {
    console.log('Record On !')

    this.setState({
      recordBool: this.state.recordBool ? false : true
    })
  }
  
  sensorCall(bool) {
    var subscription = []
    if (bool) {
      console.log('sensorCall..')
      Sensors.setUpdateIntervalForType(Sensors.SensorTypes.accelerometer, 1000);
      Sensors.setUpdateIntervalForType(Sensors.SensorTypes.gyroscope, 1000);
      Sensors.setUpdateIntervalForType(Sensors.SensorTypes.magnetometer, 1000);
      Sensors.setUpdateIntervalForType(Sensors.SensorTypes.barometer, 1000);

    subscription = [
        acc_sub = Sensors.accelerometer.subscribe(({ x, y, z }) => {
          timestamp = moment().format('YYYY-MM-DD HH:mm:ss.SSSS')
          this.setState({
              acc: {
                x, y, z, timestamp
              }
          })
          // console.log(this.state.acc.x, this.state.acc.y)
        }),
        gyro_sub = Sensors.gyroscope.subscribe(({ x, y, z }) => {
          timestamp = moment().format('YYYY-MM-DD HH:mm:ss.SSSS')
          this.setState({
              gyro: {
                x, y, z, timestamp
              }
          })
          // console.log(this.state.gyro.x, this.state.gyro.y)
        }),
        mag_sub = Sensors.magnetometer.subscribe(({ x, y, z }) => {
          timestamp = moment().format('YYYY-MM-DD HH:mm:ss.SSSS')
          this.setState({
              mag: {
                x, y, z, timestamp
              }
          })
        }),
        baro_sub = Sensors.barometer.subscribe(({ pressure }) => {
          timestamp = moment().format('YYYY-MM-DD HH:mm:ss.SSSS')
          this.setState({
              baro: {
                pressure, timestamp
              },
          })
        })
      ]
    }
    else {
      acc_sub.unsubscribe();
      gyro_sub.unsubscribe();
      mag_sub.unsubscribe();
      baro_sub.unsubscribe();
    }
    
  }


  // ************************ Geolocation
  componentDidMount() {
    console.log('DidMount..')
    /* Activate sensors fetching */
    this.sensorCall(true)

    /* Get candidate locations */
    // this.readLocations()
    this.fetchNearestPlacesFromGoogle()

    this.readCorrection()



    this._intervals = [  
      setInterval( () => this.updateGeolocation(), 1000),
      setInterval( () => this.fetchNearestPlacesFromGoogle(), 5000),
      setInterval( () => this.AnalyzeBehavior(), 1000),
      setInterval( () => this.DetermineBehavior(), 3000),
    ]
  }

  componentWillUnmount() {
    this.watchID != null && Geolocation.clearWatch(this.watchID);
    this._intervals.forEach(i => clearInterval(i))
    this.sensorCall(false)
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
        this.setState({position});

        /*
        ******************************************************************
        For Demo -> pass "Archie" geolocation -> create nearby geolocation
        ******************************************************************
        */

        /* Let randomLocation = this.getRandomLatLng(39.5490077,-119.8239203) */
        // Geocoder.from(randomLocation)

        // Geocoder.from(position.coords.latitude, position.coords.longitude)
        //     .then(json => {
        //       var addressComponent = json.results[0].formatted_address;
        //       this.setState({
        //         Address: addressComponent
        //       })

        //     })

        //     .catch(error => console.warn(error));

        

      },
      error => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }

  fetchNearestPlacesFromGoogle = () => {

    console.log("Fetch Nearest Places...")
    if (this.state.position) {
      const latitude = this.state.position.coords.latitude; // you can update it with user's latitude & Longitude
      const longitude = this.state.position.coords.longitude;
      const url =   'yourAPIkey'+latitude+','+longitude+'&radius=20'
      fetch(url)
        .then(res => {
          return res.json()
        })
        .then(res => {
          // console.log(res.results)
          var places = [] // This Array WIll contain locations received from google
          for(let googlePlace of res.results) {
            var place = {}
            var lat = googlePlace.geometry.location.lat;
            var lng = googlePlace.geometry.location.lng;
            var coordinate = {
              latitude: lat,
              longitude: lng,
            }
            place['types'] = googlePlace.types
            place['location'] = coordinate
            place['id'] = googlePlace.place_id
            place['name'] = googlePlace.name
            places.push(place);
          }
          this.setState({candidateLocations: places})
      
        })
      .catch(error => {
        console.log('e...', error);
      });
    }

  }
 
  /* Get downloaded geolocation data for Sensory coffee shop */
  readLocations() {
    console.log('readLocations..')
    var RNFS = require('react-native-fs');

    let filePath = RNFS.DocumentDirectoryPath + '/SM.js';
    if (RNFS.exists(filePath)) {
      RNFS.readFile(filePath, 'utf8')
          .then((result) => {
            console.log(result)
              // candidateLocations = JSON.parse(result.results)
              candidateLocations = result
              this.setState({candidateLocations})
              
          })
          .catch((err) => {
              console.log(err.message, err.code);
          });
    }
    console.log('candidateLocations : ', this.state.candidateLocations)
  }
  
  readCorrection() {
    console.log('readCorrection..')
    var RNFS = require('react-native-fs');

    let filePath = RNFS.DocumentDirectoryPath + '/Correction.json';

    if (RNFS.exists(filePath)) {
      // console.log('filepath1', filePath)
      RNFS.readFile(filePath, 'utf8')
          .then((result) => {

            let indexOfLast = 0
            let indexOfNext = result.indexOf("}{");
            var item = ''
            
            while(indexOfNext > 0) {
              item = result.slice(indexOfLast,indexOfNext+1)
              CorrArr.push(JSON.parse(item))
              indexOfLast = indexOfNext + 1
              indexOfNext = result.indexOf("}{", indexOfNext+1);
            }
            item = result.slice(indexOfLast, result.length)
            CorrArr.push(JSON.parse(item))
            
          })
          .catch((err) => {
            console.log(err.message, err.code);
            console.log('Correction has not been created yet.')
          });
    }
  }

  /* Infer behavior */
  AnalyzeBehavior() { 
    
    console.log('------------------------------------------------')
    console.log('Start Inferring...', moment().format('HH:mm:ss.SSSS'))
    // console.log('recordBool', this.state.recordBool)

    /** Set Behavior as 'default' */
    let behavior = 'default'

    

    let HasCorrection = false
    
    /** Get user-chosen behavior in history data */
    if (CorrArr.length > 0 && this.state.position) {
      console.log('Check Correction data...')
      CorrArr.forEach(
        item => {

          console.log('corr_item', item)

          if(item.Covered == false) {

            var distance = 100

            if (item && DataIn30Secs.length > 0) {
              distance = geolib.getPreciseDistance(
                {
                  latitude: item.SensorData.position.latitude,
                  longitude: item.SensorData.position.longitude
                },
                {
                  latitude: DataIn30Secs[(DataIn30Secs.length)-1].position.latitude,
                  longitude: DataIn30Secs[(DataIn30Secs.length)-1].position.longitude
                }
              )
            }
            
            if (distance < 60) {
              
              console.log(item.CorrectionBehavior)
              if (behaviors_URIs[item.CorrectionBehavior]) {
                console.log('Icon found', item.CorrectionBehavior)
                behavior = item.CorrectionBehavior;
                NoIconText = ''
              }
              else {
                NoIconText = item.CorrectionBehavior
                behavior = 'default'
                console.log('No icon found', item.CorrectionBehavior)
              }

              /** Correction Data Match Current Location */
              HasCorrection = true
            }
          }
        }
      )
      this.setState({ behavior });
      
    }

    
    /** No Correction Data Is Nearby Current Location */
    if (!HasCorrection && this.state.position) {
      console.log('No Correction Data works')

      /** Compute the Distance  Unit:meter/10s */
      let LastInData = [], FirstInData = []
      var distance = 0

      if ( DataIn30Secs.length > 0 ) {
        // console.log(DataIn30Secs[(DataIn30Secs.length)-1].position.latitude)
        // console.log(DataIn30Secs)
        LastInData[0] = DataIn30Secs[(DataIn30Secs.length)-1].position.latitude
        LastInData[1] = DataIn30Secs[(DataIn30Secs.length)-1].position.longitude
        FirstInData[0] = DataIn30Secs[0].position.latitude
        FirstInData[1] = DataIn30Secs[0].position.longitude

      
      distance = geolib.getPreciseDistance({
        latitude: LastInData[0],
        longitude: LastInData[1]},{
        latitude: FirstInData[0],
        longitude: FirstInData[1]})
      }

      console.log('ddd', distance)

    
      // if ( (Math.abs(this.state.acc.x) > 0.1 && Math.abs(this.state.acc.y) > 0.1) && distance > 10 ) {
      if ( distance > 5 ) {
    
        /**
         * It's probably moving -> Decide which way:  1.Walk 2.Run 3.Cycling 3.Car
         * Need Velocity -> Need Geolocation
         * */ 
        console.log('Device is moving...')
        
        

        
        // console.log(DataIn30Secs[0].acc.timestamp, DataIn30Secs[(DataIn30Secs.length)-1].acc.timestamp)
        console.log('Distance is : ' + distance)

        this.setState({
          distance: distance,
          LastInData: LastInData,
          FirstInData: FirstInData
        })
        

        

        /** The Velocity of the Object is similar to Walking, Running, or Driving */
        
        /** Default moving behavior is PHONE */
        behavior = 'walking'
        if (Math.abs(distance) > 15 && Math.abs(distance) <= 30) {
          // this.setModalVisible(true);
          behavior = 'running'
        }
        else if (Math.abs(distance) > 30 && Math.abs(distance) <= 45) {
          behavior = 'bike'
        }
        else if (Math.abs(distance) > 45) {
          behavior = 'driving'
        }
        else {
          console.log('User is not moving...')
        }
        behavior = 'driving'
      }
      /** Moving ENDS */
      
      else {
        /**
         * It's not moving -> Decide Behavior -> Need Candidate Location
         * Here the model use top 5 results in Candidate Location
         */
        console.log('Not Moving...')


        var First_shop_name = '', First_shop_types = [], candidate_behaviors = []

        /** Default: Candidate Location[0] */

        cand = this.state.candidateLocations

        // cand = [
        //   { types: [ 'movie_theater' ],
        //     location: { latitude: 39.5032737, longitude: -119.8053357 },
        //     id: 'ChIJdwIWcZFAmYARYUeZeDZ32zY',
        //     name: "Riverside century theater" },
        //   { types: [ 'food', 'restaurant', 'bar', 'cafe' ],
        //     location: { latitude: 39.5032737, longitude: -119.8053357 },
        //     id: 'ChIJdwIWcZFAmYARYUeZeDZ32zY',
        //     name: "wild river grille" },
        //   { types: [ 'supermarket' ],
        //     location: { latitude: 39.5296329, longitude: -119.8138027 },
        //     id: 'ChIJnaCSkq5AmYARh_c4dM7FxUA',
        //     name: 'SafeWay' },
        //   { types: [ 'shopping_mall' ],
        //   location: { latitude: 39.5296529, longitude: -119.8137027 },
        //   id: 'ChIJnaCSkq5AmYARh_c4dM7FxUA',
        //   name: 'Legend Outlet' },
        //   { types: [ 'dentist' ],
        //   location: { latitude: 39.5296345, longitude: -119.8136027 },
        //   id: 'ChIJnaCSkq5AmYARh_c4dM7FxUA',
        //   name: 'Hugh Family Dentistry' }
        // ]

        if (cand) {
 
          console.log('kuku', cand)
          
          shopping_related = 0

          /** Put every recognized behavior into array */
          for(i=0; i<cand.length; i++) {
            for(j=0; j<cand[i].types.length; j++) {
              if(Object.keys(behaviors_URIs).includes(cand[i].types[j])) {
                candidate_behavior = cand[i].types[j]
                if(!First_shop_name) {
                  First_shop_name = cand[i].name.toLowerCase()
                }
                
                First_shop_types = cand[i].types
                // j = cand[i].types.length - 1
                // i = cand.length - 1
                candidate_behaviors.push(candidate_behavior)
              }
            }
          }

          this.setState({candidate_behaviors})

          /** Use first type of first shop */
          if (candidate_behaviors.length > 0) {
            behavior = candidate_behaviors[0]
          }
          

          console.log('First', candidate_behaviors)
          

          /**
           * Priority: Food > Bar > Cafe
           * Restaurant || Food
           * */
          if (behavior == 'restaurant' || behavior == 'food') {
            console.log('innnn')
            if (First_shop_name.indexOf('sandwich') > -1 || First_shop_name.indexOf('subway') > -1) {
              console.log('indexof : ', First_shop_name.indexOf('sandwich'))
              behavior = 'sandwich'
            }
            if (First_shop_name.indexOf('pizza') > -1) {
              behavior = 'pizza'
            }
            if (First_shop_name.indexOf('hamburger') > -1 || First_shop_name.indexOf('burger') > -1 ||
            First_shop_name.indexOf('mcdonald') > -1 || First_shop_name.indexOf('shake shack') > -1) {
              behavior = 'hamburger'
            }
            if (First_shop_name.indexOf('ramen') > -1) {
              behavior = 'ramen'
            }
            if (First_shop_name.indexOf('ice cream') > -1) {
              behavior = 'ice_cream'
            }
            if (First_shop_name.indexOf('taco') > -1) {
              behavior = 'taco'
            }
          }
          // else if (First_shop_types.includes('bar')) {
          //   behavior = 'bar'
          // }
          // else if (First_shop_types.includes('cafe')){
          //   behavior = 'cafe'
          // }
        }        
      }
      /** Not Moving ENDS */
    }
    /** No Correction ENDS */
    /** Current behavior has been created */
    console.log(resting_sec)

    // if(Last_Behavior != behavior){
    //   if(Last_Behavior=='walking'||Last_Behavior=='running'||Last_Behavior=='bike') {
    //     var resting_counts = setInterval( () => {
    //       resting_sec += 1
    //     }, 100)
    //   }
    //   else if(Last_Behavior=='driving') {
    //     console.log('DRIVING!!!')
    //     var resting_counts = setInterval( () => {
    //       resting_sec += 1
    //     }, 1000)
    //   }
    // }

    // if(resting_sec != -1) {
    //   if(resting_sec <= 300) {
    //     behavior = Last_Behavior
    //   }
    //   else{
    //     clearInterval(resting_counts)
    //   }
    // }


    console.log('****** New ****** ', behavior, First_shop_name)

    this.beforeDetermine(behavior)

  }


  DetermineBehavior() {

    /** Use the 10 Latest Behavior to Determine Final Behavior */

    var top10arr = []
    for (i=1; i<=10; i++) {
      // console.log('DataIn30Secs'+i, DataIn30Secs[i])
      if (DataIn30Secs[i]) {
        top10arr.push(DataIn30Secs[i].behavior)
      } else {
        top10arr.push('default')
      }
    }

    const behaviors_count = [
      ['bar', 0],
      ['bike', 0],
      ['book_store', 0],
      ['boxing', 0],
      ['cafe', 0],
      ['casino', 0],
      ['dance', 0],
      ['default', 0],
      ['dentist', 0],
      ['department_store', 0],
      ['driving', 0],
      ['donut', 0],
      ['food', 0],
      ['fishing', 0]
      ['game', 0],
      ['guitar', 0],
      ['gym', 0],
      ['hair_care', 0],
      ['hamburger', 0],
      ['ice_cream', 0],
      ['library', 0],
      ['laundry', 0],
      ['movie_theater', 0],
      ['park', 0],
      ['piano', 0],
      ['pizza', 0],
      ['phone', 0],
      ['primary_school', 0],
      ['ramen', 0],
      ['running', 0],
      ['school', 0],
      ['shit', 0],
      ['shitting', 0],
      ['soccer', 0],
      ['secondary_school', 0],
      ['sleeping', 0],
      ['sandwich', 0],
      ['supermarket', 0],
      ['shopping_mall', 0],
      ['taco', 0],
      ['walking', 0],
      ['wine', 0],
      ['working', 0],
      ['workout', 0]
    ]

    var max = 0, behavior = ''

    for (i=0; i<10; i++) {
      for (j=0; j<behaviors_count.length; j++) {
        if (behaviors_count[j][0] == top10arr[i]) {
          behaviors_count[j][1] += 1
        }
        /** Highest Occurrence Will be the Determined Behavior*/
        if (behaviors_count[j][1] > max) {
          max = behaviors_count[j][1]
          behavior = behaviors_count[j][0]
        }
      }
      // console.log(`${behavior} exceeds max value: ${max}`)
    }

    console.log(behaviors_count)

    /** However, Moving behavior Has Higher Priority */
    for (i=0; i<behaviors_count.length; i++) {
      if (behaviors_count[i][0] == 'phone' || behaviors_count[i][0] == 'walking' || behaviors_count[i][0] == 'running' || behaviors_count[i][0] == 'bike' || behaviors_count[i][0] == 'driving') {
        if (behaviors_count[i][1] >= 3) {
          behavior = behaviors_count[i][0]
        }
      }
    }

    this.setState({ behavior });
    // console.log(`In Analyze, state.behavior: ${this.state.behavior}`)

    

    
    
    /** Determine Final Behavior in Fetching.js, and send it back to ShowMap.js */
    console.log(`DecideBehavior in Fetching: ${behavior} & NoIconText: ${NoIconText}`)
    this.props.SendResultToShowmap(behavior, this.state.data, NoIconText, this.state.candidate_behaviors)
  }
  

  /** Log */

  /** Put data of SensorView & Geolocation together */
  beforeDetermine(currentbehavior) {
    console.log('beforeDetermine.......')
    var data = {}

    /** Analyzed Behavior Changes */
    if (currentbehavior != Last_Behavior) {
      console.log('Behavior CHANGES', Last_Behavior, currentbehavior )
      data.behavior_CHANGED = `CHANGE from ${Last_Behavior} to `
      data.Last_Behavior = Last_Behavior
    } else {
      data.behavior_CHANGED = 'NULL'
      resting_sec = -1
    }

    data.acc = this.state.acc
    // data.gyro = this.state.gyro
    // data.mag = this.state.mag
    // data.baro = this.state.baro

    if(this.state.distance && this.state.LastInData && this.state.FirstInData) {
      data.distance = this.state.distance
      data.LastInData = this.state.LastInData
      data.FirstInData = this.state.FirstInData
    }

    /* Record data in device */
    if(this.state.position) {
      data.position = this.state.position.coords
      console.log(`In beforeDetermine, current behavior: ${currentbehavior}`)
      data.behavior = currentbehavior

      /** When Users Actively Change/Choose Behavior */
      // console.log('bef_force', force)
      if(force == 'bike' || force == 'running') {
        data.behavior  = force
      }

      this.setState({data})

      /** Log */
      if (this.state.recordBool) {
        this.writeLog(data)
      }
      
      if (DataIn30Secs.length == 11) {
        const DataShifted = DataIn30Secs.shift()
        // console.log('Remove Data',DataShifted)
      }
      DataIn30Secs.push(data)
    }

    /** Record this behavior for next behavior to compare */
    Last_Behavior = currentbehavior

  }

  // ************************ Record data to device
  writeLog(data) {
    var RNFS = require('react-native-fs');
    var path = RNFS.DocumentDirectoryPath + '/log.json';
    console.log('Start writing...')
    
    RNFS.readFile(path, 'utf8')
      .then((success) => {
          var LogFile = JSON.parse(success)
          var LogArr = LogFile.results

          LogArr.push(data)
          console.log(LogFile)
          // LogFile.results = LogArr
      
          // /** Append the content to the file */ 
          RNFS.writeFile(path, JSON.stringify(LogFile, null, 2), 'utf8')
            .then((success) => {
              console.log('appended....');
            })
            .catch((err) => {
              console.log(err.message);
          })
      })



    this.setState({
      lastWriteTime: moment().format('YYYY-MM-DD HH:mm:ss.SSSS')
    })
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible })
  }

  

  render() { 
    var record = 'OFF'
    if (this.state.recordBool) {
      record = 'On'
    }
    return (
      <>

      </>
    )
  }

}


const styles = StyleSheet.create({
  matchParent: {
      flex: 1,
  },
  
  modalView: {
      margin: 20,
      backgroundColor: "pink",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
  },
  openButton: {
      backgroundColor: "#F194FF",
      borderRadius: 5,
      padding: 10,
      elevation: 2
  },
  textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
  },
  modalText: {
      marginBottom: 15,
      textAlign: "center",
      fontSize: 15
  },
  tinyBehavior: {
    width: 100,
    height: 100,
  },
    
})