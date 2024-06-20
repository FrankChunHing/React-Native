import AsyncStorage from '@react-native-async-storage/async-storage';

export const useFetchPrice = async () => {
  const storedSymbol = await AsyncStorage.getItem('symbol');
  let url = `https://api.coinbase.com/v2/exchange-rates?currency=${storedSymbol}`;
  let price 
  try {
    const res = await fetch(url);
    const data = await res.json();
    price = data.data.rates.USD;
  } catch (error) {
    console.error('Could not fetch price data', error);
  
};
  return price
};
