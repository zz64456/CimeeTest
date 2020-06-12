import React from 'react'
import LoginScreen from "react-native-login-screen";

// function login(text) {
//     alert(text)
// }

const Login = ( {navigation} ) => {
    // const greeting = 'Hello'
    return (
        <LoginScreen
            onPressSettings={() => alert("Settings Button is pressed")}
            loginText="loginText"
            onPressLogin={() => {
                alert('hey')
            }}
        />
    );
}

export default Login