import React from 'react'
import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import { Icon } from 'react-native-elements'

const SettingHeader = ( {navigation} ) => {

    return (
        <>
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
        </>
    );
}

const styles = StyleSheet.create({
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
        flexDirection: 'row',
        backgroundColor: 'skyblue',
        justifyContent: 'center',
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

export default SettingHeader;