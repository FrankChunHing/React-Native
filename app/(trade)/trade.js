import React, {useEffect, useState, useRef} from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, 
    Text, TouchableOpacity, Image, View, Pressable,
    ActivityIndicator, TextInput, Modal} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Octicons, Feather, MaterialIcons} from '@expo/vector-icons';
import ModalRender from './modalRender';
import { fetchPrice } from '../hooks/fetchPrice';
import * as Linking from 'expo-linking';
import TradingLog from './tradingLog';
// import { storePriceData } from '../services/storePriceService';

const Trade = () => {
    const [coinData, setCoinData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPressed, setIsPressed] = useState(false);
    const [search, setSearch] = useState();
    const navigation  = useNavigation();
    const [firstFiveCoins, setFirstFiveCoins] = useState([])
    const intervalRef = useRef(null);

// async function fetchPrice(){
//     const url = `https://api.coincap.io/v2/assets`
//     try {
//         const res = await fetch(url);
//         const data = await res.json();
//         console.log(data)
//         setCoinData(data.data)
//         setFirstFiveCoins(data.data.slice(0, 5));
//         setLoading(false);
//     } catch (error) {
//         console.error(`could not fetch coins' data`, error);
//     }}



function constFetchingPrice(){
        setInterval(async () => {
            const result = await fetchPrice();
            if (result){
                setCoinData(result);
                setFirstFiveCoins(result.slice(0, 5))
                console.log("fetched price result:", result)
                await AsyncStorage.setItem('fetchedPriceData', JSON.stringify(result));
            }
    }, 15000)
}



    useEffect(() => {
        
        const interval = constFetchingPrice(); 
        // fetching every 10 seconds
        async function getCoinData(){
            try{
            const result = await fetchPrice();
            if (result){
                setLoading(false);
                setCoinData(result);
                setFirstFiveCoins(result.slice(0, 5))
                console.log("inital fetched price result:", result)
                await AsyncStorage.setItem('fetchedPriceData', JSON.stringify(result));
            }
            } catch (error){
                console.error('Could not get coins data', error);
            }


        }
        getCoinData()
        intervalRef.current = interval;
        return () => clearInterval(intervalRef.current);
      }, []);


    function handlePress(symbol){
        AsyncStorage.setItem('symbol', symbol)
        navigation.navigate('(trade)' );
    }


    function toggleSearch(){
        setIsPressed(!isPressed)
    }

    const Item = ({item}) => {
        const backgroundColor = item.changePercent24Hr >= 0 ? "green" : "red"
        return (
        <TouchableOpacity style={styles.eachRender} role="button" onPress={() => handlePress(item.symbol)}>
            <View style={styles.textBox}>
                <Text style={styles.text}>{item.id} ({item.symbol})</Text>
                <View style={styles.insideTextBox}>
                    <Text style={styles.text}>{
                        Number(item.priceUsd) >= 1 ?
                        (Number(item.priceUsd)).toFixed(2) :
                        (Number(item.priceUsd)).toFixed(5) }
                    </Text>
                    <Text style={[styles.text, styles.percent, {backgroundColor} ]}>
                        {item.changePercent24Hr >= 0 ? `+${(item.changePercent24Hr * 1).toFixed(2)}` 
                            : (item.changePercent24Hr * 1).toFixed(2)}%
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )}



    if (loading) {
        return (
            <SafeAreaView style={styles.main}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }



    return (
        <>
            
            <SafeAreaView style={styles.searchBox}>
                <StatusBar backgroundColor='lightgreen' barStyle='default' />
                <Pressable onPress={() => {toggleSearch()}} style={styles.searchTouch}>
                    <Octicons name="search" size={20} style={styles.glass}/>
                    <TextInput placeholder='BTC' 
                        value={search}   
                        style={styles.search}
                        onChangeText={setSearch} />
                </Pressable>
                <Pressable style={styles.iconTouch}>
                    <Feather name="bell" size={18} color="white" />
                    <Feather name="help-circle" size={18} color="white" />
                    <MaterialIcons name="attach-money" size={19} color="white" 
                    onPress={() => navigation.navigate('LOG' )}/>
                </Pressable>
            </SafeAreaView>
            <ModalRender 
                coinData={coinData}
                isPressed={isPressed}
                toggleSearch={() => toggleSearch()}
                />

            <SafeAreaView style={styles.main}>
                <StatusBar backgroundColor='lightgreen' barStyle='default' />
                <FlatList
                    data={firstFiveCoins}
                    renderItem={Item}
                    keyExtractor={(item) => item.id}
                    // extraData={selectedId}
                />
            </SafeAreaView>
        </>
    );
}


const styles = StyleSheet.create({
    main: {
        backgroundColor: "black",
    },
    eachRender:{
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 8,
        // borderRadius: 10,
        // shadowColor: '#333333',
        // shadowOffset: { width: 5, height: 5 },
        // shadowOpacity: 0.6,
        // shadowRadius: 4,
        // elevation: 5,
        // alignItems: 'center',
        flex: 1,
        
    },
    textBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    insideTextBox: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    text: {
        color: 'white',
        marginHorizontal: 10,
        padding: 5,
    },
    percent: {
        padding: 5,
        borderRadius: 5,
        color: 'white',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "black",
        
    },
    searchTouch: {
        flexDirection: 'row',
        flex: 2,
        alignItems: 'center',
        margin: 6,
        marginLeft: 20,
        backgroundColor: "#181818",
        borderRadius: 10,
        height: 30,
    },
    iconTouch:{
        flex: 1,
        marginLeft: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        
    },
    glass:{
        color: 'grey',
        padding: 2,
    },
    search: {
        color: "grey",
        fontSize: 15,
        padding: 2,
        flex: 1,
    },  

})


export default Trade;