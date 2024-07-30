import { useState, useEffect } from 'react';
import { loadLocalTradingData } from '../services/loadStorage';
import { calCashUsed } from './calCashUsed';

const useLoadTradingData = () => {
  const [data, setData] = useState([]);
  const [cashUsed, setCashUsed] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const result = await loadLocalTradingData();
      if (result) {
        setData(result);
        setCashUsed(calCashUsed(result));
      }
    };
    fetchData();
  }, [cashUsed]);

  return {data, cashUsed};
}

export default useLoadTradingData;
