import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import React, { Component } from "react";
import { Text, View, Button } from "react-native";
// import {
//   SavingInfoScreen1,
//   S2,
// } from './screens/SavingInfoScreen'
import FetchingScreen from './screens/FetchingScreen'
import HomeScreen from './screens/HomeScreen'
import RegisterScreen from './screens/RegisterScreen'
import LoginScreen from "./screens/LoginScreen";

import ShowMap from './components/showMap';

function DetailsScreen({ navigation, route }) {
  const { itemId } = route.params;
  // const { otherParam } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Text>itemId: {JSON.stringify(itemId)}</Text>
      {/* <Text>otherParam: {JSON.stringify(otherParam)}</Text> */}
      <Button
        title="Go to Details... again"
        onPress={() =>
          navigation.push('Details', {
            itemId: Math.floor(Math.random() * 100),
          })
        }
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      
    </View>
  );
}

const Stack = createStackNavigator();

export default class App extends Component {

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{
    headerShown: false
  }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
          <Stack.Screen name="Login" component={LoginScreen} />
          {/* <Stack.Screen name="Register"component={RegisterScreen} /> */}
          <Stack.Screen name="Fetching" component={FetchingScreen} />

          <Stack.Screen name="ShowMap" component={ShowMap} />

        </Stack.Navigator>
      </NavigationContainer>
      
      
    );
  }
}