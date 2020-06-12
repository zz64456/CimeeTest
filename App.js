import React, { Component } from "react";
// import { ScrollView, Text, SafeAreaView, View, StyleSheet, Button, TextInput } from "react-native";

import { Provider as PaperProvider } from 'react-native-paper';
import App from './src';


const Main = () => (
  <PaperProvider theme="">
    <App/>
  </PaperProvider>
  
);
 
export default Main;
