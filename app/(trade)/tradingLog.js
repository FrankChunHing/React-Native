import React, {useEffect, useState} from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, 
    Text, TouchableOpacity, Image, View, Pressable, useColorScheme,
    ActivityIndicator, TextInput, Modal} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadTradingData } from '../services/loadStorage';
import { calCashUsed } from '../utils/calCashUsed';
import useLoadTradingData from '../utils/useLoadTradingData';
import { ScrollView } from 'react-native-gesture-handler';
const TradingLog = () => {
  // const [executions, setExecutions] = useState([])
  // const [orders, setOrders] = useState([])
  const [cash, setCash] = useState(100000);
  const { data, cashUsed } = useLoadTradingData();


  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    if (cashUsed !== undefined) {
      setCash(prevCash => prevCash - cashUsed);
    }
  }, [cashUsed]);



  function renderTrades(data){

    return data.map((trade, index) => 
      <ScrollView key={index}>
        <Text>{trade.symbol}/USD</Text>
        <Text>Order: {trade.order} {trade.action}  size: {trade.slotSize}</Text>
        <Text>{trade.order === "market" ? `market price: ${trade.currentPrice}` 
          : `limit order price: ${trade.limitOrderPrice}` }</Text>
      </ScrollView>
    )
  }
  
  const styles = StyleSheet.create({
    text:{
      color: isDarkMode  ? 'white' : 'black',
    }
  })

  return (
    <SafeAreaView>
        <StatusBar backgroundColor='lightgreen' barStyle='default' />
        <View>
            <Text style={styles.text}>Cash Position: ${cash}</Text>
            <Text style={styles.text}>{cashUsed}</Text>
            {renderTrades(data)}
        </View>
    </SafeAreaView>
  )
}

export default TradingLog

