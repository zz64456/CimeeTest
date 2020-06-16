import React, { Component } from "react";
import { Text, View, Button, StyleSheet } from "react-native";

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
            {/* <Text style={styles.text}>Welcome to Cimee</Text> */}
            <Logo />
            
            <Button title="Login" onPress={() => navigation.navigate('Login')} />
            {/* <Button title="Go to MapView"
                onPress={() => navigation.navigate('ShowMap')} /> */}
            {/* <Button title="Go to SavingInfo" onPress = { () => {navigation.navigate('SavingInfo')} } /> */}
            {/* <Button title="Go to Fetching" onPress = { () => {navigation.navigate('Fetching')} } /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
    //   position: 'absolute',
    //   top: 10,
    //   left: 10,
        padding: 10,
        fontSize: 20
    },
  });
