import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, FlatList, ScrollView, Image, Alert } from 'react-native'
// import { Icon } from 'react-native-elements'
// import { ScrollView } from 'react-native-gesture-handler';
import { CheckBox, Icon } from 'react-native-elements'

export default class Setting extends React.Component{

    constructor() {
        super()
        this.state = {
            ShareBool : true,
            LowBattery : false,
            Device : true,
        }
    }


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
                    
                </View>
                <View style={{fontSize:30, alignSelf:'center', marginTop: 5,}}>
                    <Text style={{fontSize:30, fontWeight:'500', fontFamily:'cochin'}}>Setting</Text>
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
                                        containerStyle = {{backgroundColor: '#E4F2F9'}}
                                        title={item.text}
                                        checked={this.state[item.key]}
                                        onPress={() => this.setState({[item.key]: !this.state[[item.key]]})}
                                    />
                                    </>
                                }
                            />
                        {/* </View> */}
                    </View>
                    <View style={styles.friendblock}>
                        {/* <View style={styles.friendlist}> */}
                            <View style={{ margin: 10, alignItems:'flex-end'}}>
                                <Icon 
                                    style={{ marginRight: 10}}
                                    size={30}
                                    name='plus'
                                    type='simple-line-icon'
                                    color='#517fa4'
                                    onPress={ () => Alert.alert('Add Friends here.')}
                                />
                            </View>
                            
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
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <View style={styles.friend}>
                                        <Image 
                                            style={styles.avatar}
                                            source={{uri: item.uri}} />
                                        <Text style={styles.friendsText}>{item.key}</Text>
                                    </View>
                                    <View style={{ alignItems:'flex-end', right: 30}}>
                                        <Icon 
                                            style={styles.friendsBan}
                                            name='ban'
                                            type='simple-line-icon'
                                            color='#517fa4'
                                            onPress={ () => Alert.alert('Ban a friend.')}
                                        />
                                    </View>
                                </View>
                                </>
                                }
                            />
                            {/* </View> */}
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
        // backgroundColor: 'yellow',
        // alignItems: 'center',
        // justifyContent: 'center',
        // flexDirection: 'row'
    },
    back: {
        height: 40,
        paddingTop: 10,
        flexDirection: 'row',
        backgroundColor: '#D3F5F4',
    },
    backText: {
        marginLeft: 10,
        fontSize: 20
    },
    optionblock: {
        // flex: 1,
        // backgroundColor: 'lightgreen',
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
        width: 380,
        // backgroundColor: 'white',
        height: 400,
    },
    friend: {
        flexDirection: 'row',
        // backgroundColor: 'brown',
        width: 200,
    },
    friendsText: {
        fontSize: 25,
        paddingTop: 10,
    },
    friendsBan: {
        marginLeft: 10,
        paddingTop: 10,
    },
    avatar: {
        width: 50,
        height: 50,
    }
})