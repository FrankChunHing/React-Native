import { FlatList, SafeAreaView, StatusBar, StyleSheet, 
  Text, TouchableOpacity, Image, View, Pressable,
  ActivityIndicator, TextInput, Modal} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {VictoryBar, VictoryChart, VictoryAxis, 
  VictoryTheme, VictoryCandlestick, VictoryLine} from "victory-native"


  // LogBox.ignoreLogs([
  //   "Require cycle: node_modules/victory",
  // ]);

const tradingFunction = () => {

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [symbol, setSymbol] = useState('');

  async function fetchChart(){
    try {
      const storedSymbol = await AsyncStorage.getItem('symbol');
      if (storedSymbol) {
        setSymbol(storedSymbol);
        let url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${storedSymbol}&tsym=USD&limit=50&api_key=accac784ddca067dea515977aa6d63db0b844c7f1b6a89afecfea41a4d1a9de0`;
        console.log(url);
        const res = await fetch(url);
        const data = await res.json();
        console.log(data);

        const handleData  = data.Data.Data.map((item) => {

          return {
            // x: new Date(item.time * 1000),
            // open: Number(item.open),
            // close: Number(item.close),
            // high: Number(item.high),
            // low: Number(item.low)
            x: `${new Date(item.time).getMinutes()}:${new Date(item.time).getSeconds()}`,
            y: Number(item.close)
          }
        })
        console.log(handleData)
        setChartData(handleData); // Adjusted based on typical API response structure
        setLoading(false);
      } else {
        console.error('Symbol not found in AsyncStorage');
        setLoading(false);
      }
    } catch (error) {
      console.error(`Could not fetch chart data`, error);
    }}
  

  useEffect(() => {
    fetchChart()
  }, []);


  if (loading) {
    return (
        <SafeAreaView style={styles.main}>
            <ActivityIndicator size="large" color="#0000ff" />
        </SafeAreaView>
    );
  }

  return (
    <VictoryChart
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
  )
}

const styles = StyleSheet.create({
  main: {
      backgroundColor: "black",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
  },

})


export default tradingFunction