import React, { Component } from "react";
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment'
import Geocoder from 'react-native-geocoding';
import sensors, * as Sensors from "react-native-sensors";
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

const behaviors_URIs = {
  bar: "https://upload.cc/i1/2020/07/02/Ep0aGH.png",
  book_store: "https://upload.cc/i1/2020/07/23/NcJbQO.png",
  boxing: "https://upload.cc/i1/2020/07/23/S4dfaW.png",
  cafe:  "https://upload.cc/i1/2020/06/19/LbO8ft.png",
  casino: "https://upload.cc/i1/2020/07/03/mnJH1p.png",
  dance: "https://upload.cc/i1/2020/07/23/G2BcXz.png",
  default: "https://upload.cc/i1/2020/06/30/OU1LpQ.png",
  dentist: "https://upload.cc/i1/2020/07/23/M7AviL.png",
  driving: "https://upload.cc/i1/2020/06/30/sxkmeb.png",
  donut: "https://upload.cc/i1/2020/07/02/eqyHTm.png",
  game: "https://upload.cc/i1/2020/07/23/OD0e2R.png",
  guitar: "https://upload.cc/i1/2020/07/23/iIkEzH.png",
  hair_care: "https://upload.cc/i1/2020/07/23/gZt82o.png",
  hamburger: "https://upload.cc/i1/2020/06/30/b7SmGF.png",
  movie: "https://upload.cc/i1/2020/07/02/OJ3FWu.png",
  piano: "https://upload.cc/i1/2020/07/23/FKbsrH.png",
  pizza: "https://upload.cc/i1/2020/07/02/U83Gth.png",
  phone: "https://upload.cc/i1/2020/07/13/UChrb7.png",
  running: "https://upload.cc/i1/2020/07/02/FtYQX7.png",
  sleeping: "https://upload.cc/i1/2020/07/02/tMJBNb.png",
  sandwich: "https://upload.cc/i1/2020/07/02/asWJzp.png",
  supermarket: "https://upload.cc/i1/2020/07/23/tFdTLK.png",
  shopping_mall: "https://upload.cc/i1/2020/07/23/GJ5osq.png",
  walking: "https://upload.cc/i1/2020/07/02/TkveY1.png",
  working: "https://upload.cc/i1/2020/07/02/oYQyCn.png",
  workout: "https://upload.cc/i1/2020/06/17/iXUof9.png",
  
}

const DataIn30Secs = []
var CorrArr = []
var Last_Behavior = ''
var NoIconText = ''


export default class Fetching extends Component {

  constructor() {
    super()
    this.state = {
      // behavior: 'default',
      lastWriteTime: '0',
      recordBool: false
    }

    this.AnalyzeBehavior=this.AnalyzeBehavior.bind(this);
  }

  onChangerecordBool() {
    console.log('Record On !')

    this.setState({
      recordBool: this.state.recordBool ? false : true
    })
  }
  
  sensorCall() {
    console.log('sensorCall..')
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
    console.log('DidMount..')
    /* Activate sensors fetching */
    this.sensorCall()

    /* Get candidate locations */
    // this.readLocations()
    this.fetchNearestPlacesFromGoogle()

    this.readCorrection()

    this._intervals = [  
      setInterval( () => this.updateGeolocation(), 1000),
      setInterval( () => this.fetchNearestPlacesFromGoogle(), 3000),
      setInterval( () => this.AnalyzeBehavior(), 1000),
      setInterval( () => this.DetermineBehavior(), 3000),
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

    // console.log("Fetch Nearest Places...")
    if (this.state.position) {
      const latitude = this.state.position.coords.latitude; // you can update it with user's latitude & Longitude
      const longitude = this.state.position.coords.longitude;

      const url =   'https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyBNKl2oWD9Euz0-Nd8NrCcx-yONA9r5qSA&location='+latitude+','+longitude+'&radius=20'

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
          console.log('placesQQQ', places)
          // this.setState({ })
          // Do your work here with places Array
      
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

    let filePath = RNFS.DocumentDirectoryPath + '/coffeeExample_rankbydistance.json';
    if (RNFS.exists(filePath)) {
      RNFS.readFile(filePath, 'utf8')
          .then((result) => {
              candidateLocations = JSON.parse(result.results)
              this.setState({candidateLocations})
              // console.log('name type : ', typeof(this.state.candidateLocations.results[0].name))
          })
          .catch((err) => {
              console.log(err.message, err.code);
          });
    }
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
    

    if (CorrArr.length > 0 && this.state.position) {
      console.log('Check Correction data...')
      CorrArr.forEach(
        item => {

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

              console.log('No icon found', item.CorrectionBehavior)
            }

            /** Correction Data Match Current Location */
            HasCorrection = true
          }
        }
      )
      this.setState({ behavior });
      
    }

    /** No Correction Data Is Nearby Current Location */
    if (!HasCorrection && this.state.position) {
      console.log('No Correction Data works')

      // console.log('Start Inferring...', moment().format('HH:mm:ss.SSSS'))
    
      if ( Math.abs(this.state.acc.x) > 0.1 && Math.abs(this.state.acc.y) > 0.1) {
    
        /**
         * It's probably moving -> Decide which way:  1.Walk  2.Bike  3.Car
         * Need Velocity -> Need Geolocation
         * */ 
        console.log('Device is moving...')


        
        /** Compute the Distance  Unit:meter/10s */
        let LastInData = [], FirstInData = []
        if ( DataIn30Secs[(DataIn30Secs.length)-1].position ) {
          // console.log(DataIn30Secs[(DataIn30Secs.length)-1].position.latitude)
          // console.log(DataIn30Secs[0].position.latitude)
          LastInData[0] = DataIn30Secs[(DataIn30Secs.length)-1].position.latitude
          LastInData[1] = DataIn30Secs[(DataIn30Secs.length)-1].position.longitude
          FirstInData[0] = DataIn30Secs[0].position.latitude
          FirstInData[1] = DataIn30Secs[0].position.longitude
        }
        

        // console.log(LastInData)
        // console.log(FirstInData)
        
        let distance = geolib.getPreciseDistance({
          latitude: LastInData[0],
          longitude: LastInData[1]},{
          latitude: FirstInData[0],
          longitude: FirstInData[1]})
        
        console.log(DataIn30Secs[0].acc.timestamp, DataIn30Secs[(DataIn30Secs.length)-1].acc.timestamp)
        console.log('Distance is : ' + distance)

        this.setState({
          distance: distance,
          LastInData: LastInData,
          FirstInData: FirstInData
        })
          

        /** The Velocity of the Object is similar to Walking, Running, or Driving */
        
        /** Default moving behavior is PHONE */
        behavior = 'phone'
        if (Math.abs(distance) > 8 && Math.abs(distance) <= 16) {
          behavior = 'walking'
        } else if (Math.abs(distance) > 16 && Math.abs(distance) <= 70) {
          behavior = 'running'
        } else if (Math.abs(distance) > 70) {
          behavior = 'driving'
        } else {
          console.log('User is not moving...')
        }

      }
      /** Moving ENDS */
      
      else {
        /**
         * It's not moving -> Decide Behavior -> Need Candidate Location
         * Here the model use top 5 results in Candidate Location
         */
        console.log('Not Moving...')


        var shop_name, shop_types = ''

        /** Default: Candidate Location[0] */

        if (this.state.candidateLocations) {
          // console.log('state.candidate', this.state.candidateLocations)
          cand = this.state.candidateLocations
          // console.log('canddd', cand[0])
          i = 0
          while((cand[i].types.includes("route") || cand[i].types.includes("locality")) && i<cand.length) {
            console.log('includes route', cand[i])
            i += 1
          }
          
          console.log('final', cand[i])
          shop_name = cand[i].name.toLowerCase()
          shop_types = cand[i].types
          console.log('Top 1: ', shop_name, shop_types)

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
        }        
      }
      /** Not Moving ENDS */
    }
    /** No Correction ENDS */
    /** Current behavior has been created */

    console.log('****** New ****** ', behavior)

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
      ['book_store', 0],
      ['boxing', 0],
      ['cafe', 0],
      ['casino', 0],
      ['dance', 0],
      ['default', 0],
      ['dentist', 0],
      ['driving', 0],
      ['donut', 0],
      ['game', 0],
      ['guitar', 0],
      ['hair_care', 0],
      ['hamburger', 0],
      ['movie', 0],
      ['piano', 0],
      ['pizza', 0],
      ['phone', 0],
      ['running', 0],
      ['sleeping', 0],
      ['sandwich', 0],
      ['supermarket', 0],
      ['shopping_mall', 0],
      ['walking', 0],
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
      if (behaviors_count[i][0] == 'phone' || behaviors_count[i][0] == 'walking' || behaviors_count[i][0] == 'running' || behaviors_count[i][0] == 'driving') {
        if (behaviors_count[i][1] >= 3) {
          behavior = behaviors_count[i][0]
        }
      }
    }

    this.setState({ behavior });
    // console.log(`In Analyze, state.behavior: ${this.state.behavior}`)

    
    
    /** Determine Final Behavior in Fetching.js, and send it back to ShowMap.js */
    console.log(`DecideBehavior in Fetching: ${behavior} & NoIconText: ${NoIconText}`)
    this.props.SendResultToShowmap(behavior, this.state.data, NoIconText)
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

  render() { 
    // console.log('render..')
    var record = 'OFF'
    if (this.state.recordBool) {
      record = 'On'
    }
    return (
      <>
      {/* <View style={{flexDirection: 'row', marginBottom: 15, marginTop: 30,}}>
        <TouchableOpacity style={{height: 30, marginRight: 15, backgroundColor: "#DDDDDD",}}
          // style={styles.button}
          onPress={ () => this.onChangerecordBool()}
        >
          <Text style={{fontSize: 20}}>Record {record}</Text>
        </TouchableOpacity>

      </View> */}
      </>
    )
  }

}