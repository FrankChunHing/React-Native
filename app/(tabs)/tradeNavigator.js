import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Trade from '../(trade)/trade';
import tradingFunction from '../(trade)/tradingFunction';
import TradingLog from '../(trade)/tradingLog';
import RenderNews from '../(trade)/renderNews';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Tab = createMaterialTopTabNavigator();

const tradeNavigator = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Trade />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { backgroundColor: 'black' },
          tabBarIndicatorStyle: { backgroundColor: 'white' },
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
          tabBarPressColor: 'lightgray',
        }}
      >
        <Tab.Screen name="News" component={RenderNews} />
        <Tab.Screen name="Function" component={TradingLog} />
      </Tab.Navigator>
    </GestureHandlerRootView>
  );
}

export default tradeNavigator;

const styles = StyleSheet.create({});
