import React, { Component } from "react";
import { ScrollView, Text, SafeAreaView, View, StyleSheet } from "react-native";

import RNSensorView from "./RNSensorView";
import GeolocationView from "./GeolocationView"
import AsyncStorage from "./AsyncStorage"



export default class App extends Component {

  render() {


    return (
      <SafeAreaView>
        <ScrollView>
          <View style={styles.main}>
            <GeolocationView />
            <RNSensorView />
          </View>
          
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
