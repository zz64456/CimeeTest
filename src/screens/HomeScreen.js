import React, { Component } from "react";
import { Text, View, Button } from "react-native";

import Logo from '../components/Logo';

export default function HomeScreen({ navigation }) {
    // React.useEffect(() => {
    //   if (route.params?.post) {
    //     // Post updated, do something with `route.params.post`
    //     // For example, send the post to the server
    //   }
    // }, [route.params?.post]);
  
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Logo />
            <Text>Welcome to Cimee!</Text>
            {/* <Button icon="camera" mode="contained" onPress={() => console.log('Pressed')}>
                Press me
            </Button> */}
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
            {/* <Button title="Go to SavingInfo" onPress = { () => {navigation.navigate('SavingInfo')} } /> */}
            <Button title="Go to Fetching" onPress = { () => {navigation.navigate('Fetching')} } />
        </View>
    );
}
