import React, { Component } from "react";
import { ScrollView, Text, SafeAreaView, View, StyleSheet } from "react-native";

import RNSensorView from "./RNSensorView";
import GeolocationView from "./GeolocationView"
import {AsyncStorage} from "./AsyncStorage"
import Test from "./Test"



export default class App extends Component {

  ttt() {
    return (
      <Text>1234567890</Text>
    )
  }

  render() {


    return (
      <SafeAreaView>
        <ScrollView>
          <View style={styles.main}>
            <Test num="10000" /> 
            <GeolocationView />
            <RNSensorView />
            
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
  }
})
