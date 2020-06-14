import React, { Component } from 'react'
import { Text, View, SafeAreaView, StyleSheet } from 'react-native'

import MapboxGl from '@react-native-mapbox-gl/maps'

MapboxGl.setAccessToken(
	'pk.eyJ1IjoiejUyMDJkYmMiLCJhIjoiY2tiZGlsNDZjMGMwNzJ0cWVhY202NDMzMSJ9.tjMX8-zkh0OSxfs6mKtvMQ'
);

// const pointInView = await this._map.getPointInView([-37.817070, 144.949901]);

export default class showMap extends Component {
    

    onUserMarkerPress() {
        Alert.alert('You pressed on the user location annotation');
    }

    render() {
        return (
            <SafeAreaView>
                <MapboxGl.MapView
                styleURL="mapbox://styles/mapbox/streets-v11"
                >
                    <MapboxGl.Camera followZoomLevel={12} followUserLocation />
                    <Text>123</Text>
                    <MapboxGl.UserLocation onPress={this.onUserMarkerPress} />
                </MapboxGl.MapView>
                
            </SafeAreaView>
            
        )
    }
}