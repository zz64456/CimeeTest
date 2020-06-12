import React from 'react'
import LoginScreen from "react-native-login-screen";

const Login = ( {navigation} ) => {
    return (
        <LoginScreen onPressLogin={()=> console.log("hehe")} />
    );
}

export default LoginScreen