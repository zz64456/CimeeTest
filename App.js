import React, { Component } from "react";
import { ScrollView, Text, SafeAreaView, View, StyleSheet } from "react-native";

import RNSensorView from "./RNSensorView";
import GeolocationView from "./GeolocationView"
import Async from "./AsyncStorage"
import Test from "./Test"



export default class App extends Component {


  render() {


    return (
      <SafeAreaView>
        <ScrollView>
          <View style={styles.main}>
            <Test num="10000" />
            <Async name="25" />
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
