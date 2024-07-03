import React from 'react';
import { SafeAreaView, StatusBar, Text, TextInput, TouchableOpacity, Image, View, FlatList } from 'react-native';
import styles from '../styling/loginStyling';
import logo from "../../assets/images/icon2.jpg";
import eye from "../../assets/icons/eye.png";
import eyeHide from "../../assets/icons/eye-hide.png";

const loginRender = ({ username, setUsername, password, setPassword, response, showPassword, setShowPassword, fetchLogin, toRegister, renderItem }) => (
    <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor='lightgreen' barStyle='default' />
        <Image source={logo} style={styles.image} resizeMode="contain" />
        <View style={styles.form}>
            <Text style={styles.label}> Username </Text>
            <TextInput
                placeholder='Enter username'
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
                <TextInput
                    placeholder='Enter password'
                    value={password}
                    onChangeText={setPassword}
                    style={[styles.input, styles.passwordInput]}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeContainer}>
                    <Image source={showPassword ? eye : eyeHide} style={styles.eye} resizeMode='contain' />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => { fetchLogin() }}>
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
        <TouchableOpacity style={[styles.button, styles.resigerButton]} onPress={() => { toRegister() }}>
            <Text style={styles.buttonText}>Go to Register</Text>
        </TouchableOpacity>
        {/* <View style={styles.listContainer}>
            <FlatList
                data={Object.entries(loginCred).map(([id, creds]) => ({ id, ...creds }))}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View> */}
    </SafeAreaView>
);

export default loginRender;
