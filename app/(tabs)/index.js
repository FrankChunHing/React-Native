import React, {useEffect, useState} from 'react';
import * as Location from 'expo-location';
import { weatherCode } from './weatherCode.js';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Linking,
        Text, TouchableOpacity, Image, View, Platform, useColorScheme,
        ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import {useFetchedTradingData} from '../utils/useFetchedTradingData';
import { fetchTradingData } from '../services/fetchTradingData.js';


const App = () => {
  const [selectedId, setSelectedId] = useState();
  const [weatherData, setWeatherData] = useState();
  const [error, setError] = useState(null);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [username, setUsername] = useState('')
  const navigate = useNavigation();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // const { username } = route?.params ?? {};
  async function retrieveData(){
    try {
      const userData = await AsyncStorage.getItem('username');
      if (userData !== null){
        console.log('userData not null:',userData)
        console.log(typeof(userData))
        setUsername(userData)
      } else {
        console.log('userData null')
        // Linking.openURL('/login');
        navigate.navigate('(auth)')
      }
    } catch (error) {
      console.log('Failed to fetch AsyncStorage data', error);
    }
  }



  const fetchWeatherData = async () => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=weather_code,temperature_2m_max,temperature_2m_min&current=is_day`
    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log(data)
      const transformedData = data.daily.time.map((date, index) => {
        const weatherCodeForDay = data.daily.weather_code[index];
        const weatherDescription = weatherCode[weatherCodeForDay.toString()].day.description;
        const weatherPic = weatherCode[weatherCodeForDay.toString()].day.image;
        const maxTemperature = data.daily.temperature_2m_max[index];
        const minTemperature = data.daily.temperature_2m_min[index];

        return {
          id: index.toString(),
          date: date,
          description: weatherDescription,
          photoLink: weatherPic,
          maxTemperature: maxTemperature,
          minTemperature: minTemperature
        };
      });

      setWeatherData(transformedData);
      console.log('weatherData', weatherData)
    } catch (error) {
      console.error(`could not fetch weather data`, error);
    }
  };

  const getLocationPermission = async () => {
    try {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      console.log(location.coords);
      setLat(location.coords.latitude)
      setLong(location.coords.longitude)
    } catch (error) {
      console.error('Could not get location permission', error);
    }
  };

  useEffect(() => {
    retrieveData();
    getLocationPermission();
  }, []);

  useEffect(() => {
    if (lat && long) {
      fetchWeatherData();
    }
  }, [lat, long]);

  const Item = ({item, onPress, backgroundColor, textColor}) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
      <View style={styles.itemContent}>
        <Image style={styles.image} source={{ uri: item.photoLink }} />
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: textColor }]}>{item.date}</Text>
          <Text style={[styles.description, { color: textColor }]}>{item.description}</Text>
          <Text style={[styles.temperature, { color: textColor }]}>
            {item.maxTemperature}°C - {item.minTemperature}°C
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );


  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#6e3b6e' : '#f9c2ff';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  const styles = StyleSheet.create({
    container: {
      fontFamily: 'sans-serif',
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    header: {
      fontSize: 40,
      textAlign: 'center',
      color: isDarkMode  ? 'white' : 'black',
    },
    item: {
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      borderRadius: 10,
      shadowColor: '#333333',
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 0.6,
      shadowRadius: 4,
      elevation: 5,
    },
    itemContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textContainer: {
      textAlign: 'right',
      alignItems: 'center',
      flex: 1,
    },
    title: {
      fontSize: 30,
    },
    description: {
      fontSize: 22,
    },
    temperature: {
      fontSize: 22,
    },
    image: {
      height: 120,
      width: 120,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='lightgreen' barStyle='default' />
      <Text style={styles.header}> Hello {username}! Here is your local weather for the coming 7 days</Text>
      {weatherData ? 
        <FlatList
          data={weatherData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          extraData={selectedId}
        /> :
        <ActivityIndicator style={styles.container} size="large" color="midnightblue" />
    }
    </SafeAreaView>
  );
};



export default App;