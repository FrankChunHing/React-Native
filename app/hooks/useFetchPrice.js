// src/hooks/useFetchPrice.js
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useFetchPrice = (symbol) => {
  const [currentPrice, setCurrentPrice] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      const storedSymbol = symbol || await AsyncStorage.getItem('symbol');
      let url = `https://api.coinbase.com/v2/exchange-rates?currency=${storedSymbol}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        const price = data.data.rates.USD;
        setCurrentPrice(price);
      } catch (error) {
        console.error('Could not fetch price data', error);
      }
    };
    
    fetchPrice();
    const interval = setInterval(fetchPrice, 10000);
    return () => clearInterval(interval);
  }, [symbol]);

  return currentPrice;
};
