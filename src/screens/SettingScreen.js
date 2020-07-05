import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, FlatList, ScrollView, Image } from 'react-native'
import { Icon } from 'react-native-elements'
// import { ScrollView } from 'react-native-gesture-handler';
import { CheckBox } from 'react-native-elements'

export default class Setting extends React.Component{

    render() {
        return (
            <>
            
            <SafeAreaView style={styles.whole}>
            {/* <ScrollView> */}
                <View style={styles.back}>
                    <Icon
                        name='arrow-left-thick'
                        type='material-community'/>
                    <Text style={styles.backText}>Map</Text>
                    <Text style={{left:100, fontSize:30, alignSelf:'flex-start'}}>Setting</Text>
                </View>
                <View style={styles.main}>
                    <View style={styles.optionblock}>
                        {/* <View style={styles.optionlist}> */}
                            <FlatList
                                data={[
                                    {key: 'ShareBool', text: 'Share My Location'},
                                    {key: 'LowBattery', text: 'Run in  Low Battery'},
                                    {key: 'Device', text: "Connected device: Hugh's iPhone"},
                                ]}
                                renderItem={({item}) => 
                                    <>
                                    {/* <Text style={styles.optionsText}>{item.text}</Text> */}
                                    <CheckBox
                                    title={item.text}
                                    checked />
                                    </>
                                }
                            />
                        {/* </View> */}
                    </View>
                    <View style={styles.friendblock}>
                        {/* <View style={styles.friendlist}> */}
                            <FlatList
                                data={[
                                    {key: 'Devin', uri: 'https://upload.cc/i1/2020/07/05/3FBeTU.png'},
                                    {key: 'Sandy', uri: 'https://upload.cc/i1/2020/07/05/xm7uve.png'},
                                    {key: 'Dominic', uri: 'https://upload.cc/i1/2020/07/05/Nhnk4u.png'},
                                    {key: 'Jackson', uri: 'https://upload.cc/i1/2020/07/05/e4kV2Y.png'},
                                    {key: 'James', uri: 'https://upload.cc/i1/2020/07/05/dlMxzG.png'},
                                    {key: 'Julie', uri: 'https://upload.cc/i1/2020/07/05/jfqGEk.png'},
                                ]}
                                renderItem={({item}) => 
                                <>
                                <View style={styles.friend}>
                                    <Image 
                                    style={styles.avatar}
                                    source={{uri: item.uri}} />
                                    <Text style={styles.friendsText}>{item.key}</Text>
                                </View>
                                    
                                </>
                                }
                            />
                        {/* </View> */}
                    </View>
                    
                </View>
            
            {/* </ScrollView> */}
            </SafeAreaView>
            </>
        );
    }
}

const styles = StyleSheet.create({
    whole: {
        flex: 1,
        backgroundColor: '#E4F2F9',
    },
    main: {
        flex: 1,
        backgroundColor: 'yellow',
        // alignItems: 'center',
        // justifyContent: 'center',
        // flexDirection: 'row'
    },
    back: {
        height: 50,
        paddingTop: 10,
        flexDirection: 'row',
        backgroundColor: 'red',
    },
    backText: {
        marginLeft: 10,
        fontSize: 20
    },
    optionblock: {
        // flex: 1,
        backgroundColor: 'lightgreen',
        margin: 20,
        height: 180,
    },
    // optionlist: {
        
    // },
    optionsText: {
        fontSize: 25,
    },
    friendblock: {
        // flex: 1,
        alignSelf: 'center',
        width: 300,
        backgroundColor: 'white',
        height: 400,
    },
    friend: {
        flexDirection: 'row'
    },
    // friendlist: {
        
    //     alignSelf: 'center',
    //     height: 200,
    //     // justifyContent: 'center'
    // },
    friendsText: {
        fontSize: 25,
        paddingTop: 10,
    },
    avatar: {
        width: 50,
        height: 50,
    }
})