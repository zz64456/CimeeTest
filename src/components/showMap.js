import React, {Component, useState} from 'react';
import {Alert, View, TextInput, StyleSheet, Modal, TouchableHighlight, Text, Image} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

import {onSortOptions} from '../utils';

import BaseExamplePropTypes from '../common/BaseExamplePropTypes';
import TabBarPage from '../common/TabBarPage';
import Fetching from './Fetching';


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




const behaviors_URIs = {
    bar: "https://upload.cc/i1/2020/07/02/Ep0aGH.png",
    cafe:  "https://upload.cc/i1/2020/06/19/LbO8ft.png",
    casino: "https://upload.cc/i1/2020/07/03/mnJH1p.png",
    default: "https://upload.cc/i1/2020/06/30/OU1LpQ.png",
    driving: "https://upload.cc/i1/2020/06/30/sxkmeb.png",
    donut: "https://upload.cc/i1/2020/07/02/eqyHTm.png",
    hamburger: "https://upload.cc/i1/2020/06/30/b7SmGF.png",
    movie: "https://upload.cc/i1/2020/07/02/OJ3FWu.png",
    pizza: "https://upload.cc/i1/2020/07/02/U83Gth.png",
    phone: "https://upload.cc/i1/2020/07/13/UChrb7.png",
    running: "https://upload.cc/i1/2020/07/02/FtYQX7.png",
    sleeping: "https://upload.cc/i1/2020/07/02/tMJBNb.png",
    sandwich: "https://upload.cc/i1/2020/07/02/asWJzp.png",
    walking: "https://upload.cc/i1/2020/07/02/TkveY1.png",
    working: "https://upload.cc/i1/2020/07/02/oYQyCn.png",
    workout: "https://upload.cc/i1/2020/06/17/iXUof9.png",
    
  }


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

    onUserLocationUpdate(location) {
        // console.log('userlocationupdate', location)
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
                this.setState( {defaultText: behavior} )
            }
            this.writeCorrectionFile(behavior)
        }
    }

    decideBehavior(behavior, data, NoIconText) {
        this.setState({behavior})
        this.setState({data})
        console.log(`DecideBehavior in ShowMap: ${behavior}`)
        if (NoIconText) {
            this.setState({NoIconText})
        }
        console.log(`No Icon Text: ${NoIconText}`)
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
        let lng = this.state.data.position.longitude
        const correctedData = {
            SensorData: this.state.data,
            /** Here CANNOT Use state Because state is being updated  */
            CorrectionBehavior: behavior
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
        this.setModalVisible(true);
        
    }

    onPressMarker() {
        Alert.alert('Hello~')
    }

    render() {
        // console.log(`ShowMap render! ${this.state.behavior}`)
        return (
            <>
                <Fetching SendResultToShowmap={this.decideBehavior}/>
                
                <TabBarPage
                    {...this.props}
                    scrollable
                    options={this._mapOptions}
                    onOptionPress={this.onMapChange}>

                    
                    
                    <MapboxGL.MapView
                        styleURL={this.state.styleURL}
                        style={styles.matchParent}>
                        <MapboxGL.Camera followZoomLevel={9} followUserLocation />
                

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
                            decidedBehavior={this.state.behavior}
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
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Your behavior:</Text>
                            
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

