import { Stack } from 'expo-router';
import React from 'react';
export default function TradeLayout() {
  return (
    <Stack >
      <Stack.Screen name="tradingFunction" options={{ headerShown: true }}/>
    </Stack>
  );
}