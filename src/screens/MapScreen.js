import React from 'react'

import ShowMap from '../components/showMap';


// const behaviors = {
//     workout: "https://upload.cc/i1/2020/06/17/iXUof9.png",
//     coffee: "https://upload.cc/i1/2020/06/19/LbO8ft.png"
// }
// const behavior = 'coffee'
// const behavior = Fetching.getResult()
// console.log("here: ***    ",Fetching.behavior)


export default class MapScreen extends React.Component {

    onDismissExample() {
        this.props.navigation.goBack();
    }




    render() {
        return (
            <>
                {/* <Fetching /> */}
                <ShowMap
                    label='CIMEE'
                    onDismissExample={() => this.onDismissExample()}
                    // uri={behaviors[behavior]}
                />
            </>
        )
    }
}