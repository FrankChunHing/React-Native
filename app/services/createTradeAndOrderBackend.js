export async function createTradeAndOrderBackend({username, 
    time, symbol, order, action, slotSize, 
    currentPrice, limitOrderPrice}) {
        try{
            const res = await fetch(`http://localhost:8000/${username}/trades`,
                {
                    method: 'POST',
                    headers: {
                                'Access-Control-Allow-Origin': '*',
                                'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        "user_name":username, "time":time, 
                        "symbol":symbol, "type":order,"side":action,"size":slotSize,
                        "price":order === "market" ? currentPrice : limitOrderPrice,
                        "isExecuted": order === "market" ? true : false,
                        "isClosed": false
                    })
                }
            )
            const response = await res.json();
            console.log("sent POST reqest to backend server:", response)
          } catch (error) {
            console.error('Error:', error);
        }
}