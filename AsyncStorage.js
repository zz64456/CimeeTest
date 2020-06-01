import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Button
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

const STORAGE_KEY = '@save_age'


const Async: () => React$Node = (props) => {

    // console.log(props.name)

    useEffect(() => {
        readData()
    }, [])

    const [age, setAge] = useState('')

    const [alt, setAlt] = useState('')

    const saveAlt = async () => {
        try {
            setAlt(props.alt)
        await AsyncStorage.setItem(STORAGE_KEY, alt)
        alert('Data successfully saved')
        } catch (e) {
        alert('Failed to save the data to the storage')
        }
    }

    const readAlt = async () => {
        try {
        const userAlt = await AsyncStorage.getItem(STORAGE_KEY)

        if (userAlt !== null) {
            setAlt(userAlt)

        }
        } catch (e) {
        alert('Failed to fetch the data from storage')
        }
    }

    const saveData = async () => {
        try {
            setAge(props.age)
        await AsyncStorage.setItem(STORAGE_KEY, age)
        alert('Data successfully saved')
        } catch (e) {
        alert('Failed to save the data to the storage')
        }
    }

    const readData = async () => {
        try {
        const userAge = await AsyncStorage.getItem(STORAGE_KEY)

        if (userAge !== null) {
            setAge(userAge)

        }
        } catch (e) {
        alert('Failed to fetch the data from storage')
        }
    }

    const clearStorage = async () => {
        try {
        await AsyncStorage.clear()
        alert('Storage successfully cleared!')
        } catch (e) {
        alert('Failed to clear the async storage.')
        }
    }

    const onChangeText = userAge => setAge(userAge)

    const onSubmitEditing = () => {
        alert('clicked')
        if (!age) return 
        
        saveData(age)
        setAge('')
        
    }

    const btnOnPress = () => {
        alert('onpressing')
        saveData(alt)
        setAge('')
    }


    return (
        // <SafeAreaView>
        <View style={styles.container}>
            {/* <View style={styles.header}> */}
                {/* <Text style={styles.title}>iOS App</Text> */}
            {/* </View> */}
            <View style={styles.panel}>
                {/* <Text>Your age is here:</Text> */}
                <Text>{props.alt}</Text>
                {/* <TextInput
                    style={styles.input}
                    value={age}
                    placeholder="Age is just a number"
                    placeholderTextColor='grey'
                    onChangeText={onChangeText}
                    onSubmitEditing={onSubmitEditing}
                /> */}
                <Text style={styles.text}>Your altitude is {props.alt}</Text>
                {/* <TouchableOpacity onPress={clearStorage} style={styles.button}>
                    <Text style={styles.buttonText}>Clear Storage</Text>
                </TouchableOpacity> */}

                <Button onPress={btnOnPress} title='save it'></Button>
            </View>
        </View>
        // </SafeAreaView>
        
    )

    }

    const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        width: '100%',
        backgroundColor: '#dcdcdc',
        padding: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        alignItems: 'center'
    },
    title: {
        fontSize: 22,
        color: '#333',
        fontWeight: 'bold'
    },
    panel: {
        paddingTop: 40,
        alignItems: 'center'
    },
    text: {
        fontSize: 24,
        padding: 10,
        backgroundColor: '#dcdcdc'
    },
    input: {
        padding: 15,
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        margin: 10,
        color: 'black'
    },
    button: {
        margin: 10,
        padding: 10,
        backgroundColor: 'yellow'
    },
    buttonText: {
        fontSize: 18,
        color: '#444'
    }
})

export default Async