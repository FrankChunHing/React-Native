import React, {useEffect, useState} from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, 
    Text, TouchableOpacity, Image, View, Pressable,
    ActivityIndicator, TextInput, Modal} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Octicons, Feather, MaterialIcons} from '@expo/vector-icons';

const Trade = () => {
    const [coinData, setCoinData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPressed, SetIsPressed] = useState(false);
    const [search, setSearch] = useState();
    const navigation  = useNavigation();
    const [firstFiveCoins, setFirstFiveCoins] = useState([])


async function fetchPrice(){
    const url = `https://api.coincap.io/v2/assets`
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data)
        setCoinData(data.data)
        setFirstFiveCoins(data.data.slice(0, 5));
        setLoading(false);
    } catch (error) {
        console.error(`could not fetch coins' data`, error);
    }}


    useEffect(() => {
        fetchPrice()
      }, []);


    function handlePress(symbol){
        AsyncStorage.setItem('symbol', symbol)
        navigation.navigate('(trade)' );
    }


    const Item = ({item}) => {
        const backgroundColor = item.changePercent24Hr >= 0 ? "green" : "red"
        return (
        <TouchableOpacity style={styles.eachRender} role="button" onPress={() => handlePress(item.symbol)}>
            <View style={styles.textBox}>
                <Text style={styles.text}>{item.id} ({item.symbol})</Text>
                <View style={styles.insideTextBox}>
                    <Text style={styles.text}>{(Number(item.priceUsd)).toFixed(2)}</Text>
                    <Text style={[styles.text, styles.percent, {backgroundColor} ]}>
                        {item.changePercent24Hr >= 0 ? `+${(item.changePercent24Hr * 1).toFixed(2)}` 
                            : (item.changePercent24Hr * 1).toFixed(2)}%
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )}

    const ModalItem = ({item}, index) => {
        const color = item.changePercent24Hr >= 0 ? "green" : "red"
        return (
            <TouchableOpacity style={styles.eachRender} role="button">
            <View style={styles.textBox}>
                <Text>{index}</Text>
                <Text style={styles.text}>{item.symbol}/USD</Text>
                <View style={styles.insideTextBox}>
                    <Text style={styles.text}>
                        {(Number(item.priceUsd)).toFixed(2)}
                    </Text>
                    <Text style={[styles.text, styles.percent, {color} ]}>
                        {item.changePercent24Hr >= 0 ? `+${Number(item.changePercent24Hr ).toFixed(2)}` 
                                : Number(item.changePercent24Hr).toFixed(2)}%
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
        )
    }

    if (loading) {
        return (
            <SafeAreaView style={styles.main}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }


    return (
        <>
            <StatusBar backgroundColor='lightgreen' barStyle='default' />
            <View style={styles.searchBox}>
                <Pressable onPress={() => {SetIsPressed(true)}} style={styles.searchTouch}>
                    <Octicons name="search" size={20} style={styles.glass}/>
                    <TextInput placeholder='BTC' 
                        value={search}   
                        style={styles.search}
                        onChangeText={setSearch} />
                </Pressable>
                <Pressable style={styles.iconTouch}>
                    <Feather name="bell" size={18} color="white" />
                    <Feather name="help-circle" size={18} color="white" />
                    <MaterialIcons name="attach-money" size={19} color="white" />
                </Pressable>
            </View>
            <Modal
                animationType='slide'
                transparent={false}
                visible={isPressed}
                onRequestClose={() => {
                    Alert.alert("Closing popup")
                    SetIsPressed(false)
                }}>
                <>
                    <View style={styles.modalBox}>
                        <View style={styles.searchBox}>
                            <Pressable onPress={() => {SetIsPressed(true)}} style={styles.searchTouch}>
                                <Octicons name="search" size={20} style={styles.glass}/>
                                <TextInput placeholder='Search by symbol' 
                                    value={search}   
                                    style={styles.search}
                                    onChangeText={setSearch} />
                            </Pressable>
                            <TouchableOpacity onPress={() => {SetIsPressed(false)}} style={styles.iconCancel}>
                                <Text style={styles.cancel}>
                                    Cancel {search}
                                </Text>
                        </TouchableOpacity>
                        </View>                       
                        <FlatList
                            data={search ?
                                coinData.filter((coin) => coin.symbol.includes(search.toUpperCase()))
                                : coinData}
                            renderItem={ModalItem}
                            keyExtractor={(item) => item.id}
                            // extraData={selectedId}
                        />
                    </View>
                </>
            </Modal>
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
        marginLeft: 14,
        backgroundColor: "#181818",
        borderRadius: 10,
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
    },  

    modalBox: {
        backgroundColor: "black"
    },
    iconCancel:{
        marginLeft: 5,
        padding: 3,
    },
    cancel:{
        color: '#e6b800',
    },
})


export default Trade;