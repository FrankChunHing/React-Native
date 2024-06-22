
 export const useFetchChart = async (symbol) => {
      try {
          let url = `https://min-api.cryptocompare.com/data/v2/histohour?fsym=${symbol}&tsym=USD&limit=50&api_key=accac784ddca067dea515977aa6d63db0b844c7f1b6a89afecfea41a4d1a9de0`;
          const res = await fetch(url);
          const data = await res.json();
          const handleData = data.Data.Data.map((item, index) => ({
            // x: `${new Date(item.time).getMinutes()}:${new Date(item.time).getSeconds()}`,
            x: index,
            y: Number(item.close),
          }));
          console.log('handleData', handleData)
          return handleData;
      } catch (error) {
        console.error('Could not fetch chart data', error);
      } 
  
};


