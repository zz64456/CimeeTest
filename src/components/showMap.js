import React, { Component } from 'react'
import { Text, View, SafeAreaView, StyleSheet } from 'react-native'

import MapboxGl from '@react-native-mapbox-gl/maps'

MapboxGl.setAccessToken(
	'pk.eyJ1IjoiejUyMDJkYmMiLCJhIjoiY2tiZGlsNDZjMGMwNzJ0cWVhY202NDMzMSJ9.tjMX8-zkh0OSxfs6mKtvMQ'
);

export default class showMap extends Component {
    render() {
        return (
            <View>
                <MapboxGl.MapView
                    zoomLevel = {14}
                    centerCoordinate = {[11.256, 43.77]} 
                />
                {/* </MapboxGl.MapView> */}
            </View>
        )
    }
}