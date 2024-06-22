import { FlatList, SafeAreaView, StatusBar, StyleSheet, 
    Text, TouchableOpacity, Image, View, Pressable, useColorScheme,
    ActivityIndicator, TextInput, Modal, Alert, ScrollView } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RenderNews = () => {
    const [fetchNews, setFetchNews] = useState([]);

    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    async function fetchAPINews() {
        try {
            const res = await fetch(`https://newsdata.io/api/1/latest?apikey=pub_4574244eff4d87f6403b8d10ca930d66b42a8&q=market`);
            const data = await res.json();
            setFetchNews(data.results);
        } catch (error) {
            console.error(`Could not fetch news data`, error);
        }
    }

    useEffect(() => {
        fetchAPINews();
    }, []);

    const styles = StyleSheet.create({
        image: {
            height: 120,
            width: 120,
        },
        text: {
            color: isDarkMode  ? 'white' : 'black',
        }
    });

    return (
        <ScrollView>
            {fetchNews.length > 0 ? (
                fetchNews.map((data, index) => {
                    console.log(data.image_url)
                    return (
                    <View key={index}>
                        <Text style={styles.text}>{data.title}</Text>
                        <Image style={styles.image} source={{ uri: data.image_url }} />
                    </View>
                )})
            ) : (
                <ActivityIndicator size="large" color="midnightblue" />
            )}
        </ScrollView>
    );
}

export default RenderNews;


