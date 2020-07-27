import React from 'react'
import {LoginScreen as PackageLoginScreen} from "react-native-login-screen";

// function login(text) {
//     alert(text)
// }

const Login = ( {navigation} ) => {
    // const greeting = 'Hello'
    return (
        <PackageLoginScreen
            onPressSettings={() => alert("Everything already settles down.")}
            // loginText="loginText"
            onPressLogin={() => {
                navigation.navigate('Map')
            }}
            loginButtonBackgroundColor ='#b57272'
            spinnerColor='red'
        />
    );
}

export default Login