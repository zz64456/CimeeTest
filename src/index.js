import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import React, { Component } from "react";
import { ScrollView, Text, SafeAreaView, View, StyleSheet, Button, TextInput } from "react-native";
import {
  SavingInfoScreen1,
  S2,
} from './screens/SavingInfoScreen'
import Fetching from './components/Fetching'


function HomeScreen({ navigation }) {
  // React.useEffect(() => {
  //   if (route.params?.post) {
  //     // Post updated, do something with `route.params.post`
  //     // For example, send the post to the server
  //   }
  // }, [route.params?.post]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => {
          /* 1. Navigate to the Details route with params */
          navigation.navigate('Details', {
            itemId: 86,
            otherParam: 'anything you want here',
          });
        }}
      />
      <Button title="Go to SavingInfo" onPress = { () => {navigation.navigate('SavingInfo')} } />
      <Button title="Go to Fetching" onPress = { () => {navigation.navigate('Fetching')} } />
    </View>
  );
}

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

// function SavingInfoScreen1({ navigation }) {
//   return (
//     <View>
//       <Text>I am SAVINGGGGG !!!!</Text>
//     </View>
//   )
// }

// const f1  = ({ navigation }) => (
//   <View>
//       <Text>
//           I AM SAVING Sth....!!
//       </Text>
//   </View>
// );


var someData = 23

const Stack = createStackNavigator();

export default class App extends Component {

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home"component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
          {/* <Stack.Screen name="CreatePost" component={CreatePostScreen} /> */}
          <Stack.Screen name="SavingInfo" component={SavingInfoScreen1} />
          <Stack.Screen name="Fetching" component={Fetching} />
        </Stack.Navigator>
      </NavigationContainer>
      
      
    );
  }
}