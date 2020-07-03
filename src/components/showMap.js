import React, {Component, useState} from 'react';
import {Alert, View, TextInput, StyleSheet, Modal, TouchableHighlight, Text} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

import {onSortOptions} from '../utils';

import BaseExamplePropTypes from '../common/BaseExamplePropTypes';
import TabBarPage from '../common/TabBarPage';
import Fetching from './Fetching';


class ShowMap extends React.Component {

    static propTypes = {
        ...BaseExamplePropTypes,
    };

    constructor(props) {   
        super(props);
        this._mapOptions = Object.keys(MapboxGL.StyleURL)
            .map((key) => {
            return {
                label: key,
                data: MapboxGL.StyleURL[key],
            };
            })
            .sort(onSortOptions);

        this.state = {
            styleURL: this._mapOptions[5].data,
            behavior: 'default',
            modalVisible: false,
        };
        
        this.label = props.label;

        this.onMapChange = this.onMapChange.bind(this);
        this.onUserMarkerPress = this.onUserMarkerPress.bind(this);

        this.decideBehavior = this.decideBehavior.bind(this)
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    decideBehavior(behavior, data) {
        this.setState({behavior})
        this.setState({data})
        console.log(`DecideBehavior : ${behavior}`)
    }

    componentDidMount() {
        /*this._interval = setInterval(() => this.setState(({ behavior }) => {
            return {
                behavior: behavior == 'coffee' ? 'default' : 'coffee'
            };
        }), 10000)*/
        MapboxGL.locationManager.start();
    }

    componentWillUnmount() {
        //clearInterval(this._interval)
        MapboxGL.locationManager.stop();
    }

    onMapChange(index, styleURL) {
        this.setState({styleURL});
    }

    onUserMarkerPress() {
        // Alert.alert('You pressed on the user location annotation');
        // Alert.alert(this.props.uri);
        // Alert.alert(JSON.stringify(this.state.candidateLocations.results[0].name))
        // Alert.alert(this.state.behavior)
        // Alert.alert(JSON.stringify(this.state.data))
        this.setModalVisible(true);
        
        
        // Alert.alert(JSON.stringify(behaviors))
        // Alert.alert('Hello')
        // Alert.alert(JSON.stringify(this.state.candidateLocations.results.length))
    }

    render() {
        // console.log(`ShowMap render! ${this.state.behavior}`)
        return (
            <>
                <Fetching SendResultToShowmap={this.decideBehavior} />

                <TabBarPage
                    {...this.props}
                    scrollable
                    options={this._mapOptions}
                    onOptionPress={this.onMapChange}>
                    
                    <MapboxGL.MapView
                        styleURL={this.state.styleURL}
                        style={styles.matchParent}>
                        <MapboxGL.Camera followZoomLevel={13} followUserLocation />
                        
                        <MapboxGL.UserLocation
                         onPress={this.onUserMarkerPress} 
                         decidedBehavior={this.state.behavior} />
                    </MapboxGL.MapView>
                </TabBarPage>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                    }}
                    >
                    <View style={styles.matchParent}>
                        <View style={styles.modalView}>
                        <Text style={styles.modalText}>Hello World!</Text>

                        <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                            onPress={() => {
                            this.setModalVisible(!this.state.modalVisible);
                            }}
                        >
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
            </>
        );
    }
}

export default ShowMap;

const styles = StyleSheet.create({
    matchParent: {
        flex: 1,
    },
    
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
      },
      openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      }
      
})

