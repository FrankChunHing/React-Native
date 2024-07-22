import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadLocalTradingData = async() => {
    try {
        const tradingData = await AsyncStorage.getItem('userFetchedTradingData');
        const data = JSON.parse(tradingData);
        return data
    }
    catch(error){
        console.log('Error loading AsyncStorage data', error);
    }

}