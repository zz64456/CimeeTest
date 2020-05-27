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

    // Geolocation.getCurrentPosition(info => console.log(info));
    
    return (
      <SafeAreaView>
        <ScrollView>
          {viewComponents.map((Comp, index) => <Comp key={index} />)}
        </ScrollView>
      </SafeAreaView>
      
    );
  }
}
