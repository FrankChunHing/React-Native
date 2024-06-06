import { FlatList, SafeAreaView, StatusBar, StyleSheet, 
    Text, TouchableOpacity, Image, View, Pressable,
    ActivityIndicator, TextInput, Modal} from 'react-native';
  import React, {useEffect, useState} from 'react';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { Octicons} from '@expo/vector-icons';
  import { useNavigation } from '@react-navigation/native';
  const ModalRender = ({coinData, isPressed, toggleSearch}) => {
    const [search, setSearch] = useState();
    const navigation  = useNavigation();

    function handlePress(symbol){
        AsyncStorage.setItem('symbol', symbol)
        navigation.navigate('(trade)' );
    }


    const ModalItem = ({item}) => {
        const color = item.changePercent24Hr >= 0 ? "green" : "red"
        return (
            <TouchableOpacity style={styles.eachRender} role="button" onPress={() => {handlePress(item.symbol), toggleSearch()}} >
                <View style={styles.textBox}>
                    <Text style={styles.text}>• {item.symbol}/USD</Text>
                    <View style={styles.insideTextBox}>
                        <Text style={styles.text}> {
                            Number(item.priceUsd) >= 1 ?
                            (Number(item.priceUsd)).toFixed(2) :
                            (Number(item.priceUsd)).toFixed(5) }
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

    return (
        <Modal
            animationType='slide'
            transparent={false}
            visible={isPressed}
            onRequestClose={() => {
                Alert.alert("Closing popup")
                toggleSearch()
            }}>
            <>
                <StatusBar backgroundColor='lightgreen' barStyle='default' />
                <View style={styles.modalBox}>
                    <View style={styles.searchBox}>
                        <View style={styles.searchTouch}>
                            <Octicons name="search" size={20} style={styles.searchIcon}/>
                            <TextInput placeholder='Search by symbol' 
                                value={search}   
                                style={styles.search}
                                onChangeText={setSearch} />
                        </View>
                        <TouchableOpacity onPress={() => {toggleSearch()}} style={styles.iconCancel}>
                            <Text style={styles.cancel}>
                                Cancel
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
    )
  }
  
  const styles = StyleSheet.create({
    modalBox: {
        backgroundColor: "black"
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
        height: 40,
    },
    searchIcon: {
        color: 'grey',
        padding: 2,
    },
    search: {
        color: "grey",
        fontSize: 15,
        padding: 2,
        flex: 1,
    },  
    iconCancel:{
        marginLeft: 5,
        padding: 3,
    },
    cancel:{
        color: '#e6b800',
    },
    eachRender:{
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 8,
        borderRadius: 10,
        shadowColor: '#333333',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 5,
        // alignItems: 'center',
        flex: 1,
        
    },
    textBox: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        flex: 1,
    },
    insideTextBox: {
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
  })

  export default ModalRender