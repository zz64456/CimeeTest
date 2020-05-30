import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Button
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

const STORAGE_KEY = '@save_age'


const Test: () => React$Node = (props) => {

    // if(props) {
    //     props.i = 10
    // } else {
    //     props.i = 9
    // }
    
    return (
        <View>
            <Text>testing{props.num}</Text>
        </View>
        
    );
    

}



export default Test