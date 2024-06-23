import { FlatList, SafeAreaView, StatusBar, StyleSheet, 
  Text, TouchableOpacity, Image, View, Pressable, KeyboardAvoidingView,
  Platform, Keyboard, ActivityIndicator, TextInput, Modal, Alert, TouchableWithoutFeedback }
  from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryBar, VictoryChart, VictoryAxis,
  VictoryTheme, VictoryCandlestick, VictoryLine } from "victory-native";
import { storageTradingData } from '../services/storageService';
import useLoadTradingData from '../utils/useLoadTradingData';
import { calCashUsed } from '../utils/calCashUsed';
import { loadTradingData } from '../services/loadStorage';
import { useFetchChart } from '../hooks/useFetchChart';
import { useFetchPrice } from '../hooks/useFetchPrice';

const tradingFunction = () => {

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [symbol, setSymbol] = useState('');
  const [currentPrice, setCurrentPrice] = useState(null);
  const [comparePrice, setComparePrice] = useState(null);
  const [cash, setCash] = useState(100000);
  const [action, setAction] = useState('');
  const [order, setOrder] = useState('');
  const [warning, setWarning] = useState('');
  const [confirmExecution, setConfirmExecution] = useState(false);
  const [textColor, setTextColor] = useState('red');
  const intervalRef = useRef(null);
  const [slotSize, setSlotSize] = useState('');
  const [limitOrderPrice, setLimiteOrderPrice] = useState('');
  const [moveKeyboard, setMoveKeyboard] = useState(false)
  const [data, setData] = useState([]);
  const [cashUsed, setCashUsed] = useState(0);
  const [confirmTrade, setConfirmTrade] = useState(0);

  const regex = /^[0-9]*\.?[0-9]*$/;

  const fetchData = async () => {
    const result = await loadTradingData();
    if (result) {
      setData(result);
      setCashUsed(calCashUsed(result));
      setCash(100000 - calCashUsed(result))
    }
  };
  useEffect(() => {
    const init = async () => {
      try {
        const storedSymbol = await AsyncStorage.getItem('symbol');
        if (storedSymbol) {
          setSymbol(storedSymbol);
          console.log('symbol', storedSymbol);
  
          const chartPriceData = await useFetchChart(storedSymbol);
          console.log('chartPriceData', chartPriceData);
          if (chartPriceData) {
            setChartData(chartPriceData);
          }
        } else {
          console.log('Symbol not found in AsyncStorage');
        }
        setLoading(false);
        setCurrentPrice(await useFetchPrice());
        const interval = setInterval(async () => {
          setCurrentPrice(await useFetchPrice());
        }, 10000);
        intervalRef.current = interval;
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };
    init();
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {

    fetchData();
    
  }, [confirmTrade]);

  useEffect(() => {
    console.log("currentPrice", currentPrice)
    console.log("comparePrice", comparePrice)
    const timer = setTimeout(() => {
      setTextColor('black');
    }, 3000);
    
    if (currentPrice !== null && comparePrice !== null) {
      let color = currentPrice > comparePrice ? "green" : currentPrice < comparePrice ? "red" : "black";
      setTextColor(color);
    }

    setComparePrice(currentPrice);
    console.log("comparePrice updated to:", currentPrice);
    return () => clearTimeout(timer);
  }, [currentPrice]);

  if (loading) {
    return (
      <SafeAreaView style={styles.main}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  function handleInput(input) {
    
    if (regex.test(input)) {
      setWarning('');
      return true
    } else {
      setWarning('Please enter a valid number');
      return false
    }
  }



  return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor='lightgreen' barStyle='default' />
        <Text style={[styles.text, { color: textColor, fontSize: 33 }]}>
          {symbol}/USD: {currentPrice}
        </Text>
        <VictoryChart
          width={!moveKeyboard ? 500: 400}
          height={!moveKeyboard ? 300: 50}
          theme={VictoryTheme.material}
        >
          <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc"}
            }}
            data={chartData}
          />
        </VictoryChart>
        <Text style={styles.text}>USD Cash: ${cash.toFixed(2)}</Text>
        <Text style={styles.text}>Cash used: ${cashUsed.toFixed(2)}</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.buy, 
          {backgroundColor: action === "buy" ? "#32CD32" : "blue"}]} 
          onPress={() => setAction("buy")}>
            <Text style={styles.buttonText}>
              Buy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.sell, 
          {backgroundColor: action === "sell" ? "red" : "blue"}]} 
          onPress={() => setAction("sell")}>
            <Text style={styles.buttonText}>
              Sell
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.market, 
            {backgroundColor: (action === "buy" && order=== "market") 
            ? "#32CD32" : (action === "sell" && order=== "market") 
            ? "red" : '#2196F3'} ]} onPress={() => setOrder("market")}>
              <Text style={styles.buttonText}>
                Market order
              </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.limit, 
            {backgroundColor: (action === "buy" && order=== "limit") ? 
            "#32CD32" : (action === "sell" && order=== "limit") ? 
            "red" : '#2196F3'} ]} onPress={() => setOrder("limit")}>
              <Text style={styles.buttonText}>
                Limit order
              </Text>
          </TouchableOpacity>
        </View>
          <View>
            <TextInput style={styles.input} placeholder='Slot size' 
              onFocus={() => setMoveKeyboard(true)}
              onBlur={() => setMoveKeyboard(false)}
              value={slotSize} onChangeText={(value) => {
                setSlotSize(value);
                if (!handleInput(value)){setSlotSize(slotSize.replace(!regex, ''))}
                }} />
            {warning && <Text style={styles.warning}>{warning}</Text>}
            {order === 'limit' && <TextInput style={styles.input} 
              onFocus={() => setMoveKeyboard(true)}
              onBlur={() => setMoveKeyboard(false)}
              placeholder='limit order price' keyboardType='numeric' 
              value={limitOrderPrice} onChangeText={(value) => {
                setLimiteOrderPrice(value);
                if (!handleInput(value)){setLimiteOrderPrice(limitOrderPrice.replace(!regex, ''))}
                }} /> }
          </View>
        <TouchableOpacity style={styles.executeButton} onPress={() => { 
        setConfirmExecution(true);
        }}>
          <Text style={styles.buttonText}>
            Execute
          </Text>
        </TouchableOpacity>
        <Text>USD Cash, Market Value, Position</Text>
        <Modal
          animationType='slide'
          transparent={true}
          visible={confirmExecution}
          onRequestClose={() => {
            Alert.alert("Closing popup");
            setConfirmExecution(false);
          }}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
            {(!order || !action) ? 
              <Text style={{color: "red"}}> Please select Buy/Sell and order type</Text> : 
                (slotSize * currentPrice > cash && order === 'market') || 
                (slotSize * limitOrderPrice > cash && order === 'limit') ?
                <Text style={{color: "red"}}>Not enough BP</Text> :
                <>
                <Text>Confirm the trade: {order} order with slot size {slotSize} at price: { order === 'market' ? currentPrice : limitOrderPrice}</Text>
                <TouchableOpacity style={styles.modalButton} onPress={
                  async () => {
                    await storageTradingData(symbol, order, action, 
                      limitOrderPrice, currentPrice, 
                      slotSize, cash)
                    setConfirmExecution(false);
                    setConfirmTrade((prev) => prev + 1);
                    // const result = await storageTradingData(symbol, order, action, limitOrderPrice, currentPrice, slotSize, cash);

                    // if (result) {
                    //   setCash(result.newCash);
                    //   setCashUsed(result.newCashUsed);
                    // }
  }}>
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity> 
                </>}
              <TouchableOpacity style={styles.modalButton} onPress={() => setConfirmExecution(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "black",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bigContainer:{
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    marginVertical: 8,
    color: "#000",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
  },
  warning: {
    color: 'red',
  },
  executeButton: {
    backgroundColor: '#FF5722',
    padding: 10,
    borderRadius: 5,
    marginVertical: 8,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
  },
  buy: {
    backgroundColor: "green",
    width: 50,
  },
  sell: {
    backgroundColor: "red",
    width: 50,
  }
});

export default tradingFunction;
