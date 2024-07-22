import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchTradingData = async(username) => {
    try {
        const url = `http://localhost:8000/users/${username}`
        const tradingData = await fetch(url)
        // const data = JSON.parse(tradingData);
        const data = await tradingData.json();
        console.log("url", url)
        console.log("data", data)
        if (data && data.tradesAndOrders){
            const storageData = data.tradesAndOrders.map((element) => {
                return {
                "id": element.id,
                "time": element.time,
                "symbol": element.symbol,
                "order": element.type,
                "action": element.side,
                "limitOrderPrice": element.price,
                "currentPrice": element.price,
                "slotSize": element.size,
                // "cash": 100000,
                "isExecuted": element.isExecuted,
                "isClosed": element.isClosed,
            }})

            console.log("storageData", storageData)
            return storageData
        } else {
            return []
        }
        // const tradingData = await AsyncStorage.getItem('tradingData');
        // const data = JSON.parse(tradingData);
        // return data
    }
    catch(error){
        console.log('Error loading AsyncStorage data', error);
        return []
    }

}