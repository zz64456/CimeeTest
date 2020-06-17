import React from 'react'

import ShowMap from '../components/showMap';
import Fetching from '../components/Fetching';

export default class MapScreen extends React.Component {

    onDismissExample() {
        this.props.navigation.goBack();
    }

    render() {
        return (
            <>
                {/* <Fetching /> */}
                <ShowMap label='CIMEE' onDismissExample={() => this.onDismissExample()} />
            </>
        )
    }
}