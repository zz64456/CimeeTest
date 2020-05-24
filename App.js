import React, { Component } from "react";
import { ScrollView, Text, SafeAreaView, View } from "react-native";
import SensorView from "./SensorView";
import Geolocation from "@react-native-community/geolocation"


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
  render() {

    var altitude
    var position

    function showinfo(info) {
      // console.log('*****Hello*****')
      // console.log(typeof info)
      console.log(info.coords.latitude)
      altitude = info.coords.latitude
      console.log(altitude)
      // alert(altitude)
      position = info
    }
    
    Geolocation.getCurrentPosition(showinfo);
    
    alert(position)

    return (
      <SafeAreaView>
        <ScrollView>
          <View style={{ height:30, justifyContent:'center', backgroundColor:'gray' }}>
            {/* <Text style={{ fontSize:30 }}>Hi</Text> */}
            <Text>{position}</Text>
            {/* <Text>{position.coords.latitude}</Text>
            <Text>{position.coords.longitude}</Text>
            <Text>{position.timestamp}</Text> */}
          </View>
          {viewComponents.map((Comp, index) => <Comp key={index} />)}
        </ScrollView>
      </SafeAreaView>
      
    );
  }
}
