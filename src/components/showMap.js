import React, {Component, useState} from 'react';
import {Alert, FlatList, View, TextInput, StyleSheet, Modal, KeyboardAvoidingView, TouchableHighlight, Text, Image, TouchableOpacity} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

import {onSortOptions} from '../utils';

import BaseExamplePropTypes from '../common/BaseExamplePropTypes';
import TabBarPage from '../common/TabBarPage';
import Fetching from './Fetching';
import * as geolib from 'geolib';
import {behaviors_URIs} from '../bitmoji/bitmoji'

const friends = {
    'Selena': {
        type: "FeatureCollection",
        features: [{
            geometry: {
                type: "Point",
                coordinates: [121.577434, 25.164285],
        },
        type: "Feature",
        properties: {
            label: 'free',
        }
        }]
    },
    'Coco': {
        type: "FeatureCollection",
        features: [{
            geometry: {
                type: "Point",
                coordinates: [121.567004, 25.037930],
        },
        type: "Feature",
        properties: {
            label: 'free',
        }
        }]
    },
    'Katie': {
        type: "FeatureCollection",
        features: [{
            geometry: {
                type: "Point",
                coordinates: [121.467231, 25.014033],
        },
        type: "Feature",
        properties: {
            label: 'free',
        }
        }]
    },
    'Tom': {
        type: "FeatureCollection",
        features: [{
            geometry: {
                type: "Point",
                coordinates: [121.499426, 25.004712],
        },
        type: "Feature",
        properties: {
            label: 'free',
        }
        }]
    },
};


const layerStyles = {
    'Selena': {
        iconImage: 'https://upload.cc/i1/2020/07/14/08qenf.png',
        iconSize: 0.3,
        // iconAllowOverlap: true,
        iconIgnorePlacement: true,
        symbolSpacing: 300
    },
    'Coco': {
        iconImage: 'https://upload.cc/i1/2020/07/14/OoulZv.png',
        iconSize: 0.3,
        // iconAllowOverlap: true,
        iconIgnorePlacement: true,
        symbolSpacing: 300
    },
    'Katie': {
        iconImage: 'https://upload.cc/i1/2020/07/14/BeTCAa.png',
        iconSize: 0.3,
        // iconAllowOverlap: true,
        iconIgnorePlacement: true,
        symbolSpacing: 100,
        iconAllowOverlap: true
    },
    'Tom': {
        iconImage: 'https://upload.cc/i1/2020/07/14/5CHtUu.png',
        iconSize: 0.3,
        // iconAllowOverlap: true,
        iconIgnorePlacement: true,
        symbolSpacing: 100,
        iconAllowOverlap: true
    },
};

var location_when_user_changes_behavior = []

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
            l : {
                Ttimestamp: 0,
                Tlatitude: 0.0,
                Tlongitude: 0.0,
                Taltitude: 0.0,
                Theading: 0.0,
                Taccuracy: 0.0,
                Tspeed: 0.0,
            }
        };
        
        this.label = props.label;

        this.onMapChange = this.onMapChange.bind(this);
        this.onUserMarkerPress = this.onUserMarkerPress.bind(this);

        this.onUserLocationUpdate = this.onUserLocationUpdate.bind(this);

        this.decideBehavior = this.decideBehavior.bind(this)
    }

    _header = function () {
        return (
          <Text style={{fontWeight: 'bold', fontSize: 20}}>Nearby</Text>
        );
    }

    onUserLocationUpdate(location) {
        // console.log('userlocationupdate', location)
        if (location) {
            this.setState({
                l: {
                    Ttimestamp: location.timestamp,
                    Tlatitude: location.coords.latitude,
                    Tlongitude: location.coords.longitude,
                    Taltitude: location.coords.altitude,
                    Theading: location.coords.heading,
                    Taccuracy: location.coords.accuracy,
                    Tspeed: location.coords.speed,
                }
              
            });
            // console.log('userlocationupdate: ', this.state.l)
        }
        
      }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible })
        let behavior =''
        if (this.state.correctedBehavior) {
            behavior = this.state.correctedBehavior.toLowerCase()
            behavior = behavior.trim()
            console.log('User correction: ', behavior)
            if (behaviors_URIs[behavior]) {
                this.setState({ behavior })
            }
            else {
                this.setState({ behavior: 'default' })
            }
            this.writeCorrectionFile(behavior)
        }
    }

    decideBehavior(behavior, data, NoIconText, candidate_behaviors) {
        /** If user has changed behavior before,
         *  behavior won't be updated within radius of 40m
         */
        if(location_when_user_changes_behavior[0]) {
            
            let distance = geolib.getPreciseDistance({
                latitude: location_when_user_changes_behavior[0],
                longitude: location_when_user_changes_behavior[1]},{
                latitude: data.position.latitude,
                longitude: data.position.longitude
                // latitude: 39.499055,
                // longitude: -119.808349
            })
            
            if ( distance > 20 ) {
                this.setState({behavior})
            }
        } else {
            this.setState({behavior})
        }
        
        
        this.setState({data})
        // console.log('data', data)
        this.setState({candidate_behaviors})
        console.log(`DecideBehavior in ShowMap: ${behavior}`)
        if (NoIconText) {
            this.setState({NoIconText})
            console.log(`No Icon Text: ${NoIconText}`)
        }
        
    }
  
    componentDidMount() {
        /*this._interval = setInterval(() => this.setState(({ behavior }) => {
            return {
                behavior: behavior == 'coffee' ? 'default' : 'coffee'
            };
        }), 10000)*/
        MapboxGL.locationManager.start();
    }

    writeCorrectionFile(behavior) {
        var RNFS = require('react-native-fs');
        var path = RNFS.DocumentDirectoryPath + '/Correction.json';

        const correctedData = {
            SensorData: this.state.data,
            /** Here CANNOT Use state Because state is being updated  */
            CorrectionBehavior: behavior,
            Covered: false,
        }
        console.log('Start Writing Correction File...')


        if(!RNFS.exists(path)) {

            /** Write the file */
            RNFS.writeFile(path, JSON.stringify(correctedData, null, 2), 'utf8')
            .then((success) => {
                console.log('correctedData is created')
            })
            .catch((err) => {
                console.log(err.message);
            });
        }
    
        /** Append the content to the file */
        RNFS.appendFile(path, JSON.stringify(correctedData, null, 2), 'utf8')
          .then((success) => {
            console.log('correctedData is appended')
          })
          .catch((err) => {
            console.log(err.message);
        })
        
        /** Read updated Correction file */
        return (
            <Fetching SendResultToShowmap={this.decideBehavior} />
        )
    }

    componentWillUnmount() {
        //clearInterval(this._interval)
        MapboxGL.locationManager.stop();
    }

    onMapChange(index, styleURL) {
        this.setState({styleURL});
    }

    onUserMarkerPress() {
        // Alert.alert(JSON.stringify(this.state.data))
        console.log('can_be', this.state.candidate_behaviors)
        this.setModalVisible(true);
        
    }

    onPressMarker() {
        Alert.alert('Hello~')
    }

    ChooseBehavior(option) {
        this.setModalVisible(!this.state.modalVisible)
        console.log('User chooses ', option)
        this.setState({behavior: option.item})
        /** Behavior keeps the same within the range of distance diff: 50m */
        location_when_user_changes_behavior[0] = this.state.data.position.latitude
        location_when_user_changes_behavior[1] = this.state.data.position.longitude
    }

    /** Update Correction file When Users Change the Behavior */
    updateCorrection() {

        console.log('update_Correction', CorrArr)



        if(!RNFS.exists(path)) {

            /** Write the file */
            RNFS.writeFile(path, JSON.stringify(correctedData, null, 2), 'utf8')
            .then((success) => {
                console.log('correctedData is created')
            })
            .catch((err) => {
                console.log(err.message);
            });
        }
    }

    ChooseBehavior_View_Candi(item) {
        return(
            <>
                <View style={{ justifyContent: 'space-around', backgroundColor: 'white' }}>
                    
                    <TouchableOpacity
                        onPress = { () => this.ChooseBehavior({item}) }
                    >
                        {/* <Text>{item}</Text> */}
                        <Image
                            style={styles.tinyBehavior}
                            source={{
                            uri: behaviors_URIs[item],
                            }}
                        />
                    </TouchableOpacity>
                </View>
            </>
        )
    }

    ChooseBehavior_View_notCandi(item) {
        return (
            <>
            <View style={{ justifyContent: 'space-around', backgroundColor: 'white' }}>
                
                <TouchableOpacity
                    onPress = { () => this.ChooseBehavior({item}) }
                >
                    {/* <Text>{item}</Text> */}
                    <Image
                        style={styles.tinyBehavior}
                        source={{
                        uri: behaviors_URIs[item],
                        }}
                    />
                </TouchableOpacity>
            </View>
            </>
        )
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
                <MapboxGL.Camera followZoomLevel={15} followUserLocation />
        

                <MapboxGL.ShapeSource
                    id='Selena'
                    onPress={this.onPressMarker}
                    shape={friends['Selena']}>
                    <MapboxGL.SymbolLayer
                        id='Selena'
                        minZoomLevel={9}
                        style={layerStyles['Selena']}
                    />
                </MapboxGL.ShapeSource>
                <MapboxGL.ShapeSource
                    id='Coco'
                    onPress={this.onPressMarker}
                    shape={friends.Coco}>
                    <MapboxGL.SymbolLayer
                        id='Coco'
                        minZoomLevel={9}
                        style={layerStyles['Coco']}
                    />
                </MapboxGL.ShapeSource>
                <MapboxGL.ShapeSource
                    id='Katie'
                    onPress={this.onPressMarker}
                    shape={friends['Katie']}>
                    <MapboxGL.SymbolLayer
                        id='Katie'
                        minZoomLevel={9}
                        style={layerStyles['Katie']}
                    />
                </MapboxGL.ShapeSource>
                <MapboxGL.ShapeSource
                    id='Tom'
                    onPress={this.onPressMarker}
                    shape={friends['Tom']}>
                    <MapboxGL.SymbolLayer
                        id='Tom'
                        minZoomLevel={9}
                        style={layerStyles['Tom']}
                    />
                </MapboxGL.ShapeSource>
                

                <MapboxGL.UserLocation
                    onPress={this.onUserMarkerPress} 
                    Behavior={this.state.behavior}
                    NoIconText={this.state.NoIconText}
                    onUpdate={this.onUserLocationUpdate} />
            </MapboxGL.MapView>
        </TabBarPage>

        <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            /** onRequestClose is for android or Apple TV which has physical button */
            onRequestClose={() => {
                Alert.alert("Modal has been closed.");
            }}
        >

            <View style={styles.matchParent}>
                {/* <View style={styles.modalView}> */}
                <KeyboardAvoidingView style={styles.modalView} behavior="padding">
                    
                    <FlatList
                        style={{marginBottom: 5, height: 320}}
                        ListHeaderComponent={this._header}//header头部组件
                        data={this.state.candidate_behaviors}
                        numColumns={3}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item}) => this.ChooseBehavior_View_Candi(item)}
                    />

                    <FlatList
                        style={{marginBottom: 10, height: 280}}
                        ListHeaderComponent={()=>{return <Text style={{fontWeight: 'bold', fontSize: 20}}>Others</Text>}}
                        data={Object.keys(behaviors_URIs)}
                        numColumns={3}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item}) => this.ChooseBehavior_View_notCandi(item)}
                    />

                    <TextInput
                        style={{ width:100, marginBottom:10, height: 40, borderColor: 'gray', borderWidth: 1, color: 'black' }}
                        onChangeText={correctedBehavior => this.setState({correctedBehavior})}
                        // value={value}
                    />


                    <TouchableHighlight
                            style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                            onPress={() => {
                            this.setModalVisible(!this.state.modalVisible);
                            }}
                        >
                            <Text style={styles.textStyle}>OK</Text>
                    </TouchableHighlight>
                </KeyboardAvoidingView>
                {/* </View> */}
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
        height: 610,
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
    },
    tinyBehavior: {
        width: 100,
        height: 100,
    },
      
})

