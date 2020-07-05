import React from 'react'

import ShowMap from '../components/showMap';



export default class MapScreen extends React.Component {

    onDismissExample() {
        this.props.navigation.goBack();
    }
    onSetting() {
        this.props.navigation.navigate('Setting')
        // console.log('welcome')
    }
   
    render() {
        return (
            <>
                {/* <Fetching /> */}
                <ShowMap
                    label='CIMEE'
                    onDismissExample={() => this.onDismissExample()}
                    onSetting={() => this.onSetting()}
                    // uri={behaviors[behavior]}
                />
            </>
        )
    }
}