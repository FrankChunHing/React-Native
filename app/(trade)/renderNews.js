import { SafeAreaView, StyleSheet, Text, Image, View, useColorScheme, ActivityIndicator, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';

const RenderNews = () => {
    const [fetchNews, setFetchNews] = useState([]);
    const defaultImage = 'https://wallpapercave.com/wp/wp2446263.jpg';


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
        container: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
        },
        column: {
            flex: 1,
        },
        itemContainer: {
            marginBottom: 10,
        },
        image: {
            height: 120,
            width: 120,
        },
        text: {
            color: isDarkMode ? 'white' : 'black',
        }
    });

    const leftColumnNews = fetchNews.filter((_, index) => index % 2 === 0);
    const rightColumnNews = fetchNews.filter((_, index) => index % 2 !== 0);

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.column}>
                    {leftColumnNews.map((data, index) => (
                        <View style={styles.itemContainer} key={index}>
                            <Text style={styles.text}>{data.title}</Text>
                            {data.image_url && <Image style={styles.image} 
                                source={{ uri: data.image_url }} 
                                onError={(e) => {
                                    e.onerror = null; 
                                    e.src = defaultImage;
                                }}
                                />}
                        </View>
                    ))}
                </View>
                <View style={styles.column}>
                    {rightColumnNews.map((data, index) => (
                        <View style={styles.itemContainer} key={index}>
                            <Text style={styles.text}>{data.title}</Text>
                            {data.image_url && <Image style={styles.image} 
                            source={{ uri: data.image_url }} 
                            onError={(e) => {
                                e.onerror = null; 
                                e.src = defaultImage;
                            }}/>}
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

export default RenderNews;
