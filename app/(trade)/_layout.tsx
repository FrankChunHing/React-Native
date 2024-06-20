import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function TradeLayout() {

  const [storedSymbol, setStoredSymbol] = useState('');
  async function fetchStoredSymbol() {
    const symbol = await AsyncStorage.getItem('symbol');
    if (symbol) {
      setStoredSymbol(symbol);
    }
  }

  useEffect(() => {
    fetchStoredSymbol();
  }, []);

  return (
    <Stack>
      <Stack.Screen 
        name="tradingFunction" 
        options={{ 
          headerShown: true,
          headerStyle: {
            backgroundColor: 'black', // Background color of the header
          },
          headerTintColor: '#fff', // Color of the header text and icons
          headerTitleStyle: {
            fontWeight: 'bold', // Font weight of the title
            fontSize: 18, // Font size of the title
          },
          headerTitleAlign: 'center',
          title: `${storedSymbol}/USD`, 
        }}
      />
    </Stack>
  );
}