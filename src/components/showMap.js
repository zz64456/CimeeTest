import React, {Component, useState} from 'react';
import {Alert, View, TextInput, StyleSheet, Modal, TouchableHighlight, Text, Image} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

import {onSortOptions} from '../utils';

import BaseExamplePropTypes from '../common/BaseExamplePropTypes';
import TabBarPage from '../common/TabBarPage';
import Fetching from './Fetching';


const friends = {
    'free': {
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
    'cpy': {
        type: "FeatureCollection",
        features: [{
            geometry: {
                type: "Point",
                coordinates: [121.469824, 25.011796,],
        },
        type: "Feature",
        properties: {
            label: 'free',
        }
        }]
    },
    'hsiang': {
        type: "FeatureCollection",
        features: [{
            geometry: {
                type: "Point",
                coordinates: [121.493769, 25.023497],
        },
        type: "Feature",
        properties: {
            label: 'free',
        }
        }]
    },
};


const layerStyles = {
    'free': {
        iconImage: 'https://upload.cc/i1/2020/07/13/qCEB09.png',
        iconSize: 0.2,
        // iconAllowOverlap: true,
        iconIgnorePlacement: true,
        symbolSpacing: 300
    },
    'cpy': {
        iconImage: 'https://upload.cc/i1/2020/07/13/xbT42t.png',
        iconSize: 0.2,
        // iconAllowOverlap: true,
        iconIgnorePlacement: true,
        symbolSpacing: 300
    },
    'hsiang': {
        iconImage: 'https://upload.cc/i1/2020/07/13/fxR2ru.png',
        iconSize: 0.2,
        // iconAllowOverlap: true,
        iconIgnorePlacement: true,
        symbolSpacing: 300
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
            this.writeCorrectionFile(behavior)
        }
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

    writeCorrectionFile(behavior) {
        var RNFS = require('react-native-fs');
        var path = RNFS.DocumentDirectoryPath + '/Correction.json';
        const correctedData = {
            data: this.state.data,
            /** Here CANNOT Use state Because state is being updated  */
            correction: behavior
        }
        console.log('Start Writing Correction File...')

        if(!RNFS.exists(path)) {
            // Write the file
            RNFS.writeFile(path, JSON.stringify(correctedData), 'utf8')
            .then((success) => {
                console.log(correctedData)
            })
            .catch((err) => {
                console.log(err.message);
            });
        }
    
        // Append the content to the file
        RNFS.appendFile(path, JSON.stringify(correctedData), 'utf8')
          .then((success) => {
            console.log(correctedData)
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
                <Fetching SendResultToShowmap={this.decideBehavior} />
                
                <TabBarPage
                    {...this.props}
                    scrollable
                    options={this._mapOptions}
                    onOptionPress={this.onMapChange}>

                    
                    
                    <MapboxGL.MapView
                        styleURL={this.state.styleURL}
                        style={styles.matchParent}>
                        <MapboxGL.Camera followZoomLevel={12} followUserLocation />
                

                        <MapboxGL.ShapeSource
                            id='free'
                            onPress={this.onPressMarker}
                            shape={friends['free']}>
                            <MapboxGL.SymbolLayer
                                id='free'
                                minZoomLevel={12}
                                style={layerStyles['free']}
                            />
                        </MapboxGL.ShapeSource>
                        <MapboxGL.ShapeSource
                            id='cpy'
                            onPress={this.onPressMarker}
                            shape={friends.cpy}>
                            <MapboxGL.SymbolLayer
                                id='cpy'
                                minZoomLevel={12}
                                maxZoomLevel={50}
                                style={layerStyles['cpy']}
                            />
                        </MapboxGL.ShapeSource>
                        <MapboxGL.ShapeSource
                            id='hsiang'
                            onPress={this.onPressMarker}
                            shape={friends['hsiang']}>
                            <MapboxGL.SymbolLayer
                                id='hsiang'
                                minZoomLevel={12}
                                style={layerStyles['hsiang']}
                            />
                        </MapboxGL.ShapeSource>
                        

                        <MapboxGL.UserLocation
                            onPress={this.onUserMarkerPress} 
                            decidedBehavior={this.state.behavior}
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

