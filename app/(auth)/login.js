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

    const Login = () => {

      const [username, setUsername] = useState('')
      const [password, setPassword] = useState('')
      const [response, setResponse] = useState('')
      const [checkCred, setCheckCred] = useState(null)
      const [hoveredUsername, setHoveredUsername] = useState(false)
      const [hoveredPassword, setHoveredPassword] = useState(false)
      const [showPassword, setShowPassword] = useState(false)
      const navigate = useNavigation();


        // Transform loginCred into an array of entries on Cred.json
        // const credentials = Object.entries(loginCred).map(([key, value]) => ({
        //   id: key,
        //   ...value,
        // }));

      async function storeData(){
        try{
          await AsyncStorage.setItem('username', username);
        } catch (error){
          console.log('Error saving AsyncStorage data', error);
        }
      }
      

      async function fetchLogin(){
        try{
          const res = await fetch("http://localhost:8000/api/v1/user/login",{
            method: 'POST',
            headers:{
              'Access-Control-Allow-Origin': '*',
              'Content-Type':'application/json'
            },
            body: JSON.stringify({username, password})
          })
          const textResponse = await res.text();
          setResponse(textResponse);
          if (textResponse === username){
            storeData();
            navigate.navigate('(tabs)' );
          }
          console.log("Response:", textResponse);
        } catch (error) {
          console.error('Error:', error);
      }}

      function handleToggle(){

        if (username === "" || password === "") {
          alert("Please fill in all fields");
          return 
        }

        const filteredCred  = loginCred.filter(
            (cred) => {
                console.log(cred.username)
                console.log(username)
                return cred.username === username && cred.password === password}
          );
          setCheckCred(filteredCred);
          if (filteredCred.length > 0) {
            storeData()
            navigate.navigate('(tabs)' ); // Navigate to the 'index' screen
        }
      }
      
      function toRegister(){
        navigate.navigate('register')
      }

      const renderItem = ({ item }) => (
        <View style={styles.credentialContainer}>
          <Text style={styles.text}>Username: {item.username}</Text>
          <Text style={styles.text}>Password: {item.password}</Text>
        </View>
      );
    
      return (
        <SafeAreaView style={styles.container}>
          <StatusBar backgroundColor='lightgreen' barStyle='default' />
              <Image
                source={logo} style={styles.image} resizeMode="contain" />
              <View style={styles.form} >
                  <Text style={styles.label}> Username </Text>
                  <TextInput placeholder='Enter username' 
                      value={username}   
                      onChangeText={setUsername} 
                      style={[styles.input, hoveredUsername && styles.hovered]}
                      onPressIn={() => setHoveredUsername(true)}
                      onPressOut={() => setHoveredUsername(false)}
                      />
                  <Text style={styles.label}>password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput placeholder='Enter password' 
                        value={password} 
                        onChangeText={setPassword} 
                        style={[styles.input, styles.passwordInput, hoveredPassword && styles.hovered]}
                        onPressIn={() => setHoveredPassword(true)}
                        onPressOut={() => setHoveredPassword(false)}
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
                      onPress={() => {fetchLogin()}}>
                      <Text style={styles.buttonText}>Login</Text>
                  </TouchableOpacity>
                  {response && (
                      <Text style={styles.result}>
                          {response === username ? 
                              "logging in" : 
                              'Username or password incorrect'}
                      </Text>
                  )}

              </View>
              <TouchableOpacity style={[styles.button, styles.resigerButton]} 
                  onPress={() => {toRegister()}}>
                  <Text style={styles.buttonText}>Go to Register</Text>
              </TouchableOpacity>
              <View style={styles.listContainer}>
                  <FlatList
                  data={Object.entries(loginCred).map(([id, creds]) => ({ id, ...creds }))}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id}
                  />
              </View>
        </SafeAreaView>
      );
    };
      
    const styles = StyleSheet.create({
      container: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: StatusBar.currentHeight || 0,
          backgroundColor: '#ecedef',
      },
      credentialContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#ccc',
          display: 'none',
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
      listContainer: {
        width: '100%',
        display: 'none',
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
      resigerButton: {
        borderRadius: 30,
        width: 200,
        backgroundColor: "red"
      }
    });

export default Login;