import React, {useEffect, useState} from 'react';
import loginCred from "./loginCred.json"
import { useNavigation } from '@react-navigation/native';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, 
    Text, TouchableOpacity, Image, View, 
    ActivityIndicator, Button, useRoute,
    TextInput} from 'react-native';


    const Login = () => {

        const [username, setUsername] = useState('')
        const [password, setPassword] = useState('')
        const [checkCred, setCheckCred] = useState(null)
        const navigate = useNavigation();



        // Transform loginCred into an array of entries on Cred.json
        // const credentials = Object.entries(loginCred).map(([key, value]) => ({
        //   id: key,
        //   ...value,
        // }));

        function handleToggle(){
            const filteredCred  = loginCred.filter(
                (cred) => {
                    console.log(cred.username)
                    console.log(username)
                    return cred.username === username && cred.password === password}
              );
              setCheckCred(filteredCred);
              if (filteredCred.length > 0) {
                navigate.navigate('index' ); // Navigate to the 'index' screen
            }
        }
      

        const renderItem = ({ item }) => (
          <View style={styles.credentialContainer}>
            <Text style={styles.text}>Username: {item.username}</Text>
            <Text style={styles.text}>Password: {item.password}</Text>
          </View>
        );
      
        return (
          <SafeAreaView style={styles.container}>
                <View style={styles.form} >
                    <Text style={styles.label}> Username </Text>
                    <TextInput placeholder='Enter username' 
                        value={username}   
                        onChangeText={setUsername} 
                        style={styles.input}/>
                    <Text style={styles.label}>password</Text>
                    <TextInput placeholder='Enter password' 
                        value={password} 
                        onChangeText={setPassword} 
                        style={styles.input}
                        secureTextEntry 
                    />
                    <TouchableOpacity style={styles.button} 
                        onPress={() => {handleToggle()}}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    {checkCred && (
                        <Text style={styles.result}>
                            {checkCred.length > 0 ? 
                                "logging in" : 
                                'Username or password incorrect'}
                        </Text>
                    )}

                </View>
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
            backgroundColor: '#f5f5f5',
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
      });

export default Login;