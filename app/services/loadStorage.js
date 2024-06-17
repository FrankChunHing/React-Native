import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadTradingData = async() => {
    try {
        const tradingData = await AsyncStorage.getItem('tradingData');
        const data = JSON.parse(tradingData);
        return data
    }
    catch(error){
        console.log('Error loading AsyncStorage data', error);
    }

}