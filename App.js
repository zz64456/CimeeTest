import React, { Component } from "react";
import { ScrollView, Text, SafeAreaView, View, StyleSheet } from "react-native";
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

// class Position extends Component {
  
//   constructor(props) {
//     super(props)

//   }
// }

export default class App extends Component {

  render() {

    Geolocation.getCurrentPosition(info => console.log(info));


    return (
      <SafeAreaView>
        <ScrollView>
          <View style={styles.v1}>
            <Text>Hello, world!</Text>
          </View>
          <View style={styles.v2}>
            {viewComponents.map((Comp, index) => <Comp key={index} />)}
          </View>
        </ScrollView>
      </SafeAreaView>
      
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1
  },
  v1: {
    flex: 1
  },
  v2: {
    flex: 1
  },
})
