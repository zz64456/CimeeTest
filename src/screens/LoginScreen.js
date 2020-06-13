import React from 'react'
import {LoginScreen as PackageLoginScreen} from "react-native-login-screen";

// function login(text) {
//     alert(text)
// }

const Login = ( {navigation} ) => {
    // const greeting = 'Hello'
    return (
        <PackageLoginScreen
            onPressSettings={() => alert("Settings Button is pressed")}
            loginText="loginText"
            onPressLogin={() => {
                navigation.navigate('Fetching')
            }}
        />
    );
}

export default Login