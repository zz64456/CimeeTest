import React, { Component } from "react";
import { ScrollView, Text, SafeAreaView, View, StyleSheet } from "react-native";

import SensorView from "./SensorView";


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


    return (
        <View style={styles.v1}>
            {viewComponents.map((Comp, index) => <Comp key={index} />)}
        </View>
        
        
      
    );
  }
}

const styles = StyleSheet.create({

  v1: {
    flex: 1
  },
})
