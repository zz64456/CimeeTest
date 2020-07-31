import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableHighlight, Image, Alert, Modal, TextInput } from 'react-native'
// import { Icon } from 'react-native-elements'
// import { ScrollView } from 'react-native-gesture-handler';
import { CheckBox, Icon } from 'react-native-elements'

const friends = ['Devin', 'Annie', 'Kabrie', 'Coco', 'Levi', 'Selena', 'Tom', 'Katie', 'Sandy', 'Dominic', 'Jackson', 'James', 'Julie']
var f_list = [
    {key: 'Devin', uri: 'https://upload.cc/i1/2020/07/05/3FBeTU.png'},
    {key: 'Annie', uri: 'https://upload.cc/i1/2020/07/14/5ntWw8.png'},
    {key: 'Coco', uri: 'https://upload.cc/i1/2020/07/14/3mVZHB.png'},
    {key: 'Katie', uri: 'https://upload.cc/i1/2020/07/14/DhRvnM.png'},
    {key: 'Tom', uri: 'https://upload.cc/i1/2020/07/14/TnZEcP.png'},
    {key: 'Sandy', uri: 'https://upload.cc/i1/2020/07/05/xm7uve.png'},
    {key: 'Dominic', uri: 'https://upload.cc/i1/2020/07/05/Nhnk4u.png'},
    {key: 'Jackson', uri: 'https://upload.cc/i1/2020/07/05/e4kV2Y.png'},
    {key: 'Levi', uri: 'https://upload.cc/i1/2020/07/14/LnPhzw.png'},
    {key: 'James', uri: 'https://upload.cc/i1/2020/07/05/dlMxzG.png'},
    // {key: 'Julie', uri: 'https://upload.cc/i1/2020/07/05/jfqGEk.png'},
    {key: 'Selena', uri: 'https://upload.cc/i1/2020/07/14/21jhlB.png'},
    {key: 'Kabrie', uri: 'https://upload.cc/i1/2020/07/14/a9JWEy.png'},
]

export default class Setting extends React.Component{

    constructor() {
        super()
        this.state = {
            ShareBool : false,
            LowBattery : false,
            Device : true,
            modalVisible: false,
        }
    }

    AddFriend(id) {
        if(id) {
            console.log(`${id}, friend added.`)
            friend = {key:'Sandra', uri: 'https://upload.cc/i1/2020/07/05/jfqGEk.png'}
            f_list.push(friend)
        }
        
    }

    friendModalVisible = (visible) => {
        this.setState({ modalVisible: visible })
        this.AddFriend(this.state.friendsID)
        // console.log(this.state.friendsID)
    }

    onAddFriend() {
        // Alert.alert(JSON.stringify(this.state.data))
        // Alert.alert('yo')
        this.friendModalVisible(true);
        
    }

    onShareChange(item) {

        this.setState({[item.key]: !this.state[[item.key]]})

        /** General Location-sharing will update Sharing setting of Friends */

        if (item.key == 'ShareBool') {
            
            /** General Location-sharing -- ON */
            if (!this.state[[item.key]]) {
                this.onShareChangeSpecific(1, '')
            }
            /** General Location-sharing -- OFF */
            else {
                this.onShareChangeSpecific(2, '')
            }
        }
    }

    onShareChangeSpecific(type, name) {
        if (type == 1) {
            for (i=0; i<friends.length; i++) {
                name = friends[i]
                this.setState({
                    [name]: true
                })
            }
            
        }
        if(type == 2) {
            for (i=0; i<friends.length; i++) {
                name = friends[i]
                this.setState({
                    [name]: false
                })
            }
        }
        if(type == 3) {
            this.setState({
                [name]: !this.state[name]
            })
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
                                        // onPress={() => this.setState({[item.key]: !this.state[[item.key]]})}
                                        onPress={ () => this.onShareChange(item) }
                                    />
                                    </>
                                }
                            />
                        {/* </View> */}
                    </View>
                    <View style={styles.friendblock}>
                        {/* <View style={styles.friendlist}> */}
                            <View style={{ margin: 5, alignItems:'flex-end'}}>
                                <Icon 
                                    style={{ marginRight: 10}}
                                    size={30}
                                    name='plus'
                                    type='simple-line-icon'
                                    color='#517fa4'
                                    onPress={ () => this.onAddFriend()}
                                />
                            </View>
                            
                            <FlatList
                                data={f_list}
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
                                        {/* <Icon 
                                            style={styles.friendsBan}
                                            name='ban'
                                            type='simple-line-icon'
                                            color='#517fa4'
                                            onPress={ () => Alert.alert('Block a friend.')}
                                        /> */}
                                        <CheckBox
                                            containerStyle = {{backgroundColor: '#E4F2F9'}}
                                            // title={item.text}
                                            checked={this.state[item.key]}
                                            // onPress={() => this.setState({[item.key]: !this.state[[item.key]]})}
                                            onPress={() => this.onShareChangeSpecific(3, item.key)}
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



            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                /** onRequestClose is for android or Apple TV which has physical button */
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}
                >
                <View style={styles.matchParent}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Friend's ID:</Text>
                        
                        <TextInput
                            style={{ width:100, marginBottom:10, height: 40, borderColor: 'gray', borderWidth: 1, color: 'black' }}
                            onChangeText={friendsID => this.setState({friendsID})}
                            // value={value}
                        />

                        <TouchableHighlight
                            style={{ backgroundColor: "#cbd5f0", width:50 }}
                            onPress={() => {
                            this.friendModalVisible(!this.state.modalVisible);
                            }}
                        >
                            <Text style={styles.textStyle}>OK</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
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
        marginTop: 20,
        marginLeft: 20,
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
    },

    matchParent: {
        flex: 1,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    textStyle: {
        fontSize: 15,
        alignSelf: 'center'
    }
})