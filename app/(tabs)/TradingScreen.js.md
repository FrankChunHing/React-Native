// src/screens/TradingScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Text, TouchableOpacity, TextInput, View, StyleSheet, ActivityIndicator, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryChart, VictoryLine, VictoryTheme } from "victory-native";
import { useFetchPrice } from '../hooks/useFetchPrice';

const TradingScreen = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [symbol, setSymbol] = useState('');
  const [comparePrice, setComparePrice] = useState(null);
  const [cash, setCash] = useState(100000);
  const [action, setAction] = useState();
  const [order, setOrder] = useState();
  const [warning, setWarning] = useState('');
  const [confirmExecution, setConfirmExecution] = useState(false);
  const [textColor, setTextColor] = useState('red');
  const [slotSize, setSlotSize] = useState();
  const [limitOrderPrice, setLimitOrderPrice] = useState();
  const regex = /^[0-9]*\.?[0-9]*$/;



  useEffect(async () => {
    const storedSymbol = await AsyncStorage.getItem('symbol');
    if (storedSymbol) {
      setSymbol(storedSymbol)} 
    else {
        console.error('Symbol not found in AsyncStorage');
      }
    const chartPriceData = useFetchPrice(symbol);
    if (chartPriceData){
      setLoading(false);
      setChartData(chartPriceData)
    }

  }, []);

  useEffect(() => {
    if (currentPrice !== null && comparePrice !== null) {
      const color = currentPrice > comparePrice ? 'green' : currentPrice < comparePrice ? 'red' : 'black';
      setTextColor(color);
      const timer = setTimeout(() => setTextColor('black'), 2000);
      return () => clearTimeout(timer);
    }
    setComparePrice(currentPrice);
  }, [currentPrice]);

  if (loading) {
    return (
      <SafeAreaView style={styles.main}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  const handleInput = (input) => {
    if (regex.test(input)) {
      setWarning('');
      return true;
    } else {
      setWarning('Please enter a valid number');
      return false;
    }
  };

  // const storageTradingData = async (order, action, limitOrderPrice, currentPrice, slotSize, cash) => {
  //   try {
  //     const existingDataJson = await AsyncStorage.getItem('tradingData');
  //     const existingData = existingDataJson ? JSON.parse(existingDataJson) : [];
  //     const newData = { order, action, limitOrderPrice, currentPrice, slotSize, cash };
  //     const updatedData = [...existingData, newData];
  //     await AsyncStorage.setItem('tradingData', JSON.stringify(updatedData));
  //   } catch (error) {
  //     console.log('Error saving AsyncStorage data', error);
  //   }
  // };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.text, { color: textColor, fontSize: 33 }]}>{symbol}/USD: {currentPrice}</Text>
      <VictoryChart width={500} height={300} theme={VictoryTheme.material}>
        <VictoryLine style={{ data: { stroke: "#c43a31" }, parent: { border: "1px solid #ccc" }}} data={chartData} />
      </VictoryChart>
      <Text style={styles.text}>USD Cash: ${cash}</Text>
      
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
      <TextInput style={styles.input} placeholder='Enter slot size' 
        value={slotSize} onChangeText={(value) => {
          setSlotSize(value);
          if (!handleInput(value)){setSlotSize(slotSize.replace(!regex, ''))}
          }} />
      {warning && <Text style={styles.warning}>{warning}</Text>}
      {order === 'limit' && <TextInput style={styles.input} 
        placeholder='limit order price' keyboardType='numeric' 
        value={limitOrderPrice} onChangeText={(value) => {
          setLimiteOrderPrice(value);
          if (!handleInput(value)){setLimiteOrderPrice(limitOrderPrice.replace(!regex, ''))}
          }} /> }
      <TouchableOpacity style={styles.executeButton} onPress={() => { 
      setConfirmExecution(true);
      }}>
        <Text style={styles.buttonText}>
          Execute
        </Text>
      </TouchableOpacity>
      <Text>USD Cash, Market Value, Position</Text>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: "black",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
});

export default TradingScreen;
