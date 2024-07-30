import React, {useEffect, useState, useRef} from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, RefreshControl, 
    Text, TouchableOpacity, Image, View, Pressable, useColorScheme, Button,
    ActivityIndicator, TextInput, Modal} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadTradingData } from '../services/loadStorage';
import { calCashUsed } from '../utils/calCashUsed';
import useLoadTradingData from '../utils/useLoadTradingData';
import { ScrollView } from 'react-native-gesture-handler';
import useFetchedTradingData from '../utils/useFetchedTradingData';
import { amendOrderBackend } from '../services/amendOrderBackend';
import { deleteTradeAndOrderBackend } from '../services/deleteOrderBackend';
import { fetchTradingData } from '../services/fetchTradingData';


const TradingLog = () => {
  // const [executions, setExecutions] = useState([])
  // const [orders, setOrders] = useState([])
  const [initialCash, setInitialCash] = useState(100000);
  const [cash, setCash] = useState(100000);
  const [currentPriceData, setCurrentPriceData] = useState([])
  const { data, cashUsed } = useLoadTradingData();
  const intervalRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchedBackendUserTradingData, setFetchedBackendUserTradingData] = useState([]);
  const [username, setUsername] = useState('');
  const [isAmendOrderBackend, setIsAmendOrderBackend] = useState(false);
  const [getBackend, setGetBackend] = useState(0);
  const [price, setPrice] = useState("");
  const [lotsize, setLotsize] = useState("");
  const [focusId, setFocusId] = useState(0);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
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
    flatList: {
      height: 500,
      // flexGrow: 0
    },
  });

  const fetchUsername = async () => {
    try {
      const localUsername = await AsyncStorage.getItem('username');
      setUsername(localUsername);
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  const fetchedPriceDataFunction = async () => {
    try {
      const fetchedData = await AsyncStorage.getItem('fetchedPriceData');
      if (fetchedData) {
        const parsedData = JSON.parse(fetchedData);
        setCurrentPriceData(parsedData);
      }
    } catch (error) {
      console.error('Error fetching price data:', error);
    }
  };

  const fetchedPriceDataFunctionWithTime = () => {
    intervalRef.current = setInterval(async () => {
      await fetchedPriceDataFunction();
      if (username) {
        await fetchBackendUserTradingData(username);
      }
    }, 8000);
  };

  const fetchBackendUserTradingData = async (username) => {
    try {
      const userTradingData = await fetchTradingData(username);
      await AsyncStorage.setItem('userFetchedTradingData', JSON.stringify(userTradingData));
      setFetchedBackendUserTradingData(userTradingData);
      let cashUsed = calCashUsed(userTradingData);
      if (cashUsed !== undefined) {
        setCash(initialCash - cashUsed);
      }
    } catch (error) {
      console.error('Error fetching backend user trading data:', error);
    }
  };

    useEffect(() => {
      async function initialFetch() {
        await fetchedPriceDataFunction();
        await fetchUsername();
        fetchedPriceDataFunctionWithTime();
      }
      initialFetch();
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
    }}, []);


    useEffect(() => {
      async function fetchData() {
        await fetchBackendUserTradingData(username);
      }
      if (username) {
        fetchData();
      }
    }, [username, getBackend]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchedPriceDataFunction();
    setRefreshing(false);
  };

  function isNumberOrDot(input) {
    // Define a regular expression to match a number or a dot
    if (input === ""){return true}
    const regex = /^[0-9]+\.?[0-9]*$/;
    // Test the input against the regular expression
    return regex.test(input);
}
  const renderItem = ({ item }) => {
    let symbolData = currentPriceData.filter(
      (element) => element.symbol === item.symbol
    );
    let profitLoss = ((parseFloat(symbolData[0].priceUsd) - item.currentPrice) * item.slotSize).toFixed(4);
    let profitLossColor = profitLoss > 0 ? 'green' : profitLoss < 0 ? 'red' : 'black';

    return (
      <ScrollView style={styles.tradeContainer} key={item.id}>
        <Text style={styles.symbolText}>{item.symbol}/USD</Text>
        <Text style={styles.detailText}>
          Order: {item.order} {item.action} size: {item.slotSize}
        </Text>
        <Text style={styles.detailText}>
          {item.order === "market" ? `Market price: ${item.currentPrice}`
            : `Limit order price: ${item.limitOrderPrice}`}
        </Text>
        {item.order === "market" && <Text style={[styles.detailText, { color: profitLossColor }]}>
          P/L: ${profitLoss}
        </Text> }
        {item.order === "limit" && <TouchableOpacity style={styles.button} onPress={() => { 
          setIsAmendOrderBackend((priv) => !priv)
          setFocusId(item.id) }}>
            <Text style={styles.buttonText}>Amend Order</Text>
        </TouchableOpacity> }
        { isAmendOrderBackend && item.id === focusId && 
          <View>
            <TextInput
              style={styles.input}
              value={lotsize}
              onChangeText={(input) => {
                if (isNumberOrDot(input)){
                setLotsize(input)}}}
              placeholder="input order new lotsize here"
              keyboardType="decimal"
              autoComplete="off"
              required
            />
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={(input) => {
                if (isNumberOrDot(input)){
                setPrice(input)}}}
              placeholder="input new limit order price here"
              keyboardType="decimal"
              autoComplete="off"
              required
            />      
            <Button title="Submit" 
              // onPress={() => handleSubmitAmendOrderBackend(
              //   {...fetchedBackendUserTradingData.filter((element) => element.id == item.id), 
              //     "lotSize": lotsize, "limitOrderPirce": price})} 
              onPress={async () => {
                console.log("fetchedBackendUserTradingData", fetchedBackendUserTradingData)
                const orderToAmend = fetchedBackendUserTradingData.filter((element) =>  element.id === item.id) 
                const amendedOrder = {...orderToAmend[0], "slotSize": Number(lotsize), "limitOrderPrice": Number(price), username}
              console.log("amendedOrder", amendedOrder)
              await amendOrderBackend(amendedOrder)
              console.log("2")
              await fetchBackendUserTradingData(username)
              setIsAmendOrderBackend(false)}}
                  />
          </View>
        }
        {item.order === "limit" && <TouchableOpacity style={styles.button} onPress={ async () => { 
          const deleteOrder = fetchedBackendUserTradingData.filter((element) => element.id === item.id)
          const deleteInput = {username: username, ...deleteOrder[0]}
          console.log("deleteInput", deleteInput)
          await deleteTradeAndOrderBackend(deleteInput);
          setGetBackend((prev) => prev + 1);
          }}>
          <Text style={styles.buttonText}>Cancel Order</Text>
        </TouchableOpacity> }
      </ScrollView>
    );
  };


  function renderTrades(data) {
    return data.map((trade, index) => { 
      let symbolData = currentPriceData.filter(
        (element) => element.symbol === trade.symbol
      );
      let profitLoss = 
      (( parseFloat(symbolData[0].priceUsd) - trade.currentPrice) * trade.slotSize)
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


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='lightgreen' barStyle='default' />
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Cash Position: ${cash.toFixed(2)}</Text>
        <Text style={styles.subHeaderText}>Cash Used: ${cashUsed.toFixed(2)}</Text>
      </View>
      <View>
        <Text style={styles.symbolText}>Executed Trades</Text>
      </View>
      <FlatList 
        data={fetchedBackendUserTradingData.filter((element) => element.isExecuted)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
      />
      <View>
        <Text style={styles.symbolText}>Orders</Text>
      </View>
      <FlatList 
        data={fetchedBackendUserTradingData.filter((element) => !element.isExecuted)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
      />
      {/* <ScrollView contentContainerStyle={styles.scrollViewContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {renderTrades(data)}
      </ScrollView> */}
    </SafeAreaView>
  );
}



export default TradingLog;