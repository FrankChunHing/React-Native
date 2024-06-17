import AsyncStorage from '@react-native-async-storage/async-storage';

export const storageTradingData = async (symbol, order, action, limitOrderPrice, currentPrice, slotSize, cash) => {
  try {
    // Read the existing data from AsyncStorage
    const existingDataJson = await AsyncStorage.getItem('tradingData');
    const existingData = existingDataJson ? JSON.parse(existingDataJson) : [];

    // Create the new data entry
    const newData = {
      symbol,
      order,
      action,
      limitOrderPrice,
      currentPrice,
      slotSize,
      cash,
    };

    // Append the new data to the existing data
    const updatedData = [...existingData, newData];

    // Save the updated data back to AsyncStorage
    await AsyncStorage.setItem('tradingData', JSON.stringify(updatedData));
  } catch (error) {
    console.log('Error saving AsyncStorage data', error);
  }
};
