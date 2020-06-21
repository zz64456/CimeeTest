import React from 'react';
import {Alert, StyleSheet} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

// import sheet from '../styles/sheet';
import {onSortOptions} from '../utils';

import BaseExamplePropTypes from '../common/BaseExamplePropTypes';
import TabBarPage from '../common/TabBarPage';

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
            uri: props.uri,
        };
        
        this.label = props.label;

        this.onMapChange = this.onMapChange.bind(this);
        this.onUserMarkerPress = this.onUserMarkerPress.bind(this);
    }

    componentDidMount() {
        MapboxGL.locationManager.start();
    }

    componentWillUnmount() {
        MapboxGL.locationManager.stop();
    }

    onMapChange(index, styleURL) {
        this.setState({styleURL});
    }

    onUserMarkerPress() {
        // Alert.alert('You pressed on the user location annotation');
        Alert.alert(this.props.uri);
    }

    render() {
        return (
        <TabBarPage
            {...this.props}
            scrollable
            options={this._mapOptions}
            onOptionPress={this.onMapChange}>
            
            <MapboxGL.MapView
                styleURL={this.state.styleURL}
                style={styles.matchParent}>
                <MapboxGL.Camera followZoomLevel={13} followUserLocation />
                
                <MapboxGL.UserLocation onPress={this.onUserMarkerPress} uri={this.props.uri} />
            </MapboxGL.MapView>
        </TabBarPage>
        );
    }
}

export default ShowMap;

const styles = StyleSheet.create({
    matchParent: {
        flex: 1,
    }
      
})

