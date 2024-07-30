import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Trade from '../(trade)/trade';
import tradingFunction from '../(trade)/tradingFunction';
import TradingLog from '../(trade)/tradingLog';
import RenderNews from '../(trade)/renderNews';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';



const Tab = createMaterialTopTabNavigator();


const TradeTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: 'white',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: { backgroundColor: 'black' },
      tabBarIndicatorStyle: { backgroundColor: 'white' },
      tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
      tabBarPressColor: 'lightgray',
      headerShown: false, // Ensure header is hidden in nested tab navigator
    }}
  >
    <Tab.Screen name="News" component={RenderNews} />
    <Tab.Screen name="Trades & Orders" component={TradingLog} />
  </Tab.Navigator>
);
// const Stack = createMaterialTopTabNavigator();
const TradeHome = () =>     
<GestureHandlerRootView style={{ flex: 1 }} options={{ headerShown: false }}>
  <ScrollView>
    <Trade />
    <TradeTabs />
  </ScrollView>
</GestureHandlerRootView>

const tradeNavigator = () => {
  return (

    <Tab.Navigator screenOptions={{ headerShown: false, tabBarShowLabel: false}}>
      <Tab.Screen name="HOME" component={TradeHome} />
      <Tab.Screen name="LOG" component={TradingLog} />
    </Tab.Navigator>


  );
}

export default tradeNavigator;

const styles = StyleSheet.create({});
