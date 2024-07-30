export async function deleteTradeAndOrderBackend(input){
    
        try{
            const body = JSON.stringify({
                "id": input.id, "user_name":input.username, "time":0, 
                "symbol":input.symbol, "type":input.order,"side":input.action,"size":input.slotSize,
                "price": input.limitOrderPrice,
                "isExecuted": false,
                "isClosed": false
            })
            console.log("body", body)
            const res = await fetch(`http://localhost:8000/${input.username}/trades/delete`,
                {
                    method: 'DELETE',
                    headers: {
                                'Access-Control-Allow-Origin': '*',
                                'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        "id": input.id, "user_name":input.username, "time":0, 
                        "symbol":input.symbol, "type":input.order,"side":input.action,"size":input.slotSize,
                        "price": input.limitOrderPrice,
                        "isExecuted": false,
                        "isClosed": false
                    })
                }
            )
            const response = await res.json();
            console.log("sent DELETE reqest to backend server:", response)
          } catch (error) {
            console.error('Error:', error);
        }
}