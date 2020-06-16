import React from 'react'

import ShowMap from '../components/showMap';

export default class MapScreen extends React.Component {

    onDismissExample() {
        this.props.navigation.goBack();
    }

    render() {
        return (
            <ShowMap label='CIMEE' onDismissExample={() => this.onDismissExample()} />
        )
    }
}