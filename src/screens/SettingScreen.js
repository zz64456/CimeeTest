import React from 'react'
import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import { Icon } from 'react-native-elements'
import SettingHeader from '../components/SettingHeader'

export default function Setting ( {navigation} ) {

    return (
        <>
            <SafeAreaView style={styles.whole}>
                <SettingHeader />
                <View style={styles.main}>
                    <Text>Here</Text>
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    whole: {
        flex: 1,
        backgroundColor: '#E4F2F9',
    },
    main: {
        flex: 1,
        backgroundColor: 'yellow',
        alignItems: 'center',
    },
})