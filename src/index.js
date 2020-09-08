import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import React, { Component } from "react";
import { View, Text } from 'react-native'

import HomeScreen from './screens/HomeScreen'
import LoginScreen from "./screens/LoginScreen";
import MapScreen from "./screens/MapScreen";
import SettingScreen from "./screens/SettingScreen";


const Stack = createStackNavigator();

console.disableYellowBox = true;

export default class App extends Component {

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="Setting" component={SettingScreen} options={{ title: 'Settings' }} />

        </Stack.Navigator>
      </NavigationContainer>
      
      
      
    );
  }
}