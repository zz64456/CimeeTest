import React from 'react'
import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import { Icon } from 'react-native-elements'

export default function Setting ( {navigation} ) {

    return (
        <SafeAreaView style={styles.whole}>
            <View style={styles.back}>
                <Icon
                    name='arrow-left-thick'
                    type='material-community'/>
                <Text style={styles.backText}>Map</Text>
            </View>
            <View style={styles.header}>
                
                <Text style={styles.headerText}>Settings</Text>
                <Text style={styles.headerText}>Friends</Text>
            </View>
            <View style={styles.main}>
                <Text>Here</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    whole: {
        flex: 1,
        backgroundColor: '#E4F2F9',
    },
    back: {
        height: 40,
        paddingTop: 10,
        marginTop: 10,
        // marginBottom: 5,
        flexDirection: 'row',
        backgroundColor: 'red',

    },
    header: {
        height: 50,
        padding: 10,
        // marginTop: 10,
        // marginBottom: 50,
        flexDirection: 'row',
        backgroundColor: 'skyblue',
        justifyContent: 'center',
        // alignItems: 'center',
        // alignContent: 'center',
        // backgroundColor: '#c5b9eb',
    },
    main: {
        flex: 1,
        backgroundColor: 'yellow',
        alignItems: 'center',
    },
    backText: {
        marginLeft: 10,
        fontSize: 20
    },
    headerText: {
        marginLeft: 20,
        fontSize: 25,
    }
})