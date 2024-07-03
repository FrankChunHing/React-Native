import React, {useEffect, useState, useRef} from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, RefreshControl, 
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
  const [currentPriceData, setCurrentPriceData] = useState([])
  const { data, cashUsed } = useLoadTradingData();
  const intervalRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);

 async function fetchedPriceDataFunction() {
    const fetchedData = await AsyncStorage.getItem('fetchedPriceData');
      if (fetchedData) {
        const parsedData = JSON.parse(fetchedData);
        setCurrentPriceData(parsedData);
      }
  }

  function fetchedPriceDataFunctionWithTime() {
    setInterval(async () => fetchedPriceDataFunction(), 15500)
    }

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    fetchedPriceDataFunction();
    const interval = fetchedPriceDataFunctionWithTime();
    intervalRef.current = interval;
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (cashUsed !== undefined) {
      setCash(prevCash => prevCash - cashUsed);
    }
  }, [cashUsed]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchedPriceDataFunction();
    setRefreshing(false);
  };


  function renderTrades(data) {
    return data.map((trade, index) => { 
      let symbolData = currentPriceData.filter(
        (element) => element.symbol === trade.symbol
      );
      let profitLoss = 
      ((trade.currentPrice - parseFloat(symbolData[0].priceUsd)) * trade.slotSize)
        .toFixed(4);
      let profitLossColor = profitLoss > 0 ? 'green' : profitLoss < 0 ? 'red' : 'black';

      
      return (
      <View style={styles.tradeContainer} key={index}>
        <Text style={styles.symbolText}>{trade.symbol}/USD</Text>
        <Text style={styles.detailText}>
          Order: {trade.order} {trade.action} size: {trade.slotSize}
        </Text>
        <Text style={styles.detailText}>
          {trade.order === "market" ? `Market price: ${trade.currentPrice}`
            : `Limit order price: ${trade.limitOrderPrice}`}
        </Text>
        <Text style={[styles.detailText, { color: profitLossColor }]}>
          P/L: ${profitLoss}
        </Text>
      </View>
    )});
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f0f0f0',
      padding: 16,
    },
    headerContainer: {
      marginBottom: 20,
      padding: 16,
      backgroundColor: '#4CAF50',
      borderRadius: 10,
    },
    headerText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
    },
    subHeaderText: {
      fontSize: 18,
      color: '#fff',
    },
    scrollViewContainer: {
      flexGrow: 1,
    },
    tradeContainer: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 16,
      marginVertical: 8,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    symbolText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: isDarkMode ? '#fff' : '#000',
      marginBottom: 8,
    },
    detailText: {
      fontSize: 16,
      color: isDarkMode ? '#ccc' : '#333',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='lightgreen' barStyle='default' />
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Cash Position: ${cash.toFixed(2)}</Text>
        <Text style={styles.subHeaderText}>Cash Used: ${cashUsed.toFixed(2)}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {renderTrades(data)}
      </ScrollView>
    </SafeAreaView>
  );
}



export default TradingLog;