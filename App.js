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


const App: () => React$Node = () => {

  useEffect(() => {
    readData()
  }, [])

  const [age, setAge] = useState('')

  const saveData = async () => {
    try {
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
    saveData(age)
    setAge('')
  }

  // require the module
  var RNFS = require('react-native-fs');

  // create a path you want to write to
  // :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
  // but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
  var path = RNFS.DocumentDirectoryPath + '/test.txt';

  console.log('主要bundle目錄-'+RNFS.MainBundlePath);//安卓undefined或報錯
  console.log('快取目錄-'+RNFS.CachesDirectoryPath);
  console.log('文件目錄-'+RNFS.DocumentDirectoryPath);
  console.log('臨時目錄ios-'+RNFS.TemporaryDirectoryPath);//null
  console.log('外部儲存目錄android-'+RNFS.ExternalDirectoryPath);
  console.log('圖片目錄-',RNFS.PicturesDirectoryPath);

  // write the file
  RNFS.writeFile(path, 'Lorem ipsum dolor sit amet WTF!!!', 'utf8')
    .then((success) => {
      console.log('FILE WRITTEN!');
    })
    .catch((err) => {
      console.log(err.message);
    });


  return (
    // <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>iOS App</Text>
        </View>
        <View style={styles.panel}>
          <Text>Enter your age here:</Text>
          <TextInput
            style={styles.input}
            value={age}
            placeholder="Age is just a number"
            placeholderTextColor='grey'
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
          />
          <Text style={styles.text}>Your age is ***{age}</Text>
          <TouchableOpacity onPress={clearStorage} style={styles.button}>
            <Text style={styles.buttonText}>Clear Storage</Text>
          </TouchableOpacity>

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
    height: 100,
    width: '100%',
    backgroundColor: '#dcdcdc',
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'flex-end'
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

export default App