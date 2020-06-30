import React from 'react';
import {Alert, StyleSheet} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';

import {onSortOptions} from '../utils';

import BaseExamplePropTypes from '../common/BaseExamplePropTypes';
import TabBarPage from '../common/TabBarPage';
import Fetching from './Fetching';


const behaviors = {
    workout: "https://upload.cc/i1/2020/06/17/iXUof9.png",
    coffee: "https://upload.cc/i1/2020/06/19/LbO8ft.png"
}
const behavior = 'workout'


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
        };
        
        this.label = props.label;

        this.onMapChange = this.onMapChange.bind(this);
        this.onUserMarkerPress = this.onUserMarkerPress.bind(this);

        this.decideBehavior = this.decideBehavior.bind(this)
    }

    decideBehavior(behavior) {
        this.setState({behavior})
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
        // Alert.alert(this.props.uri);
        // Alert.alert(JSON.stringify(this.state.candidateLocations.results[0].name))
        Alert.alert(this.state.behavior)
        // Alert.alert(JSON.stringify(this.state.candidateLocations.results.length))
    }

    render() {
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
                        
                        <MapboxGL.UserLocation onPress={this.onUserMarkerPress} uri={behaviors[behavior]} />
                    </MapboxGL.MapView>
                </TabBarPage>
            </>
        );
    }
}

export default ShowMap;

const styles = StyleSheet.create({
    matchParent: {
        flex: 1,
    }
      
})

