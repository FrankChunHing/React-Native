import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import loginRender from '../render/loginRender';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState('');
    const [checkCred, setCheckCred] = useState(null);
    // const [hoveredUsername, setHoveredUsername] = useState(false);
    // const [hoveredPassword, setHoveredPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigation();

    async function storeData() {
        try {
            await AsyncStorage.setItem('username', username);
        } catch (error) {
            console.log('Error saving AsyncStorage data', error);
        }
    }

    async function fetchLogin() {
        try {
            const res = await fetch("http://localhost:8000/api/v1/user/login", {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const textResponse = await res.text();
            setResponse(textResponse);
            if (textResponse === username) {
                storeData();
                navigate.navigate('(tabs)');
            }
            console.log("Response:", textResponse);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function toRegister() {
        navigate.navigate('register');
    }

    const renderItem = ({ item }) => (
        <View style={styles.credentialContainer}>
            <Text style={styles.text}>Username: {item.username}</Text>
            <Text style={styles.text}>Password: {item.password}</Text>
        </View>
    );

    return loginRender({
        username,
        setUsername,
        password,
        setPassword,
        response,
        checkCred,
        showPassword,
        setShowPassword,
        fetchLogin,
        toRegister,
        renderItem,
    });
};

export default Login;

