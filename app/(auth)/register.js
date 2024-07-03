import React, {useEffect, useState} from 'react';
import loginCred from "./loginCred.json"
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, 
    Text, TouchableOpacity, Image, View, Alert,
    ActivityIndicator, Button, useRoute,
    TextInput} from 'react-native';
import logo from "../../assets/images/icon2.jpg"
import eye from "../../assets/icons/eye.png"
import eyeHide from "../../assets/icons/eye-hide.png"


const register = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [response, setResponse] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigation();

    async function fetchRegister(){
        try{
            const res = await fetch("http://localhost:8000/api/v1/user/register",{
                method: 'POST',
                headers:{
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({username, password})
            })
            const textResponse = await res.text();
            setResponse(textResponse);
            console.log("Response:", textResponse);
        } catch (error) {
            console.error('Error:', error);
        }
    }


  return (
    <SafeAreaView style={styles.container}>
    <StatusBar backgroundColor='lightgreen' barStyle='default' />
        <Image
          source={logo} style={styles.image} resizeMode="contain" />
        <Text style={styles.label}>Register User</Text>
        <Text style={styles.label}>{response}</Text>
        <View style={styles.form} >
            <Text style={styles.label}> Username </Text>
            <TextInput placeholder='Enter username' 
                value={username}   
                onChangeText={setUsername} 
                style={styles.input}
                />
            <Text style={styles.label}>password</Text>
            <View style={styles.passwordContainer}>
              <TextInput placeholder='Enter password' 
                  value={password} 
                  onChangeText={setPassword} 
                  style={[styles.input, styles.passwordInput]}
                  secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeContainer}>
                <Image
                source={showPassword ? eye : eyeHide}
                style={styles.eye}
                resizeMode='contain' />
              </TouchableOpacity>
            </View >
            <TouchableOpacity style={styles.button} 
                onPress={() => {fetchRegister()}}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </View>

  </SafeAreaView>
);
};


export default register

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: StatusBar.currentHeight || 0,
        backgroundColor: '#ecedef',
    },
    text: {
      fontSize: 16,
    },
    form: {
        height: 400,
        width: 360,
        justifyContent: "center",
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: 'grey',
        shadowOffset: {
          width: 4,
          height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
        alignSelf: 'center', // Center itself in the parent container
      },
    label: {
        fontSize: 20,
        margin: 5,
        fontWeight: '700'
    },
    input: {
        height: 50,
        borderColor: 'grey',
        borderWidth: 2,
        borderRadius: 4,
        margin: 5,
        paddingHorizontal: 20,
        color: 'blue',
        fontSize: 18,
    },
    hovered:{
      borderColor: 'blue',
    },
    button: {
      marginTop: 30,
      marginLeft: 5,
      marginRight: 5,
      height: 40,
      backgroundColor: 'blue',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      shadowColor: 'grey',
      shadowOffset: {
        width: 7,
        height: 7,
      },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 5,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    result: {
      marginTop: 30,
      height: 40,
      fontSize: 15,
      color: 'red',
    },
    image: {
      width: 200,
      height: 200,
    },
    eye:{
      width: 30,
      height: 30,
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    eyeContainer: {
      position: 'absolute',
      right: 10,
    },
    passwordInput: {
      flex: 1,
    },
    });