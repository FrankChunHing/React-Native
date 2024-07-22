export async function amendOrderBackend({username, id, time, symbol, 
    order, action, slotSize, currentPrice, limitOrderPrice}){
    try{
        console.log("PUT", `http://localhost:8000/${username}/trades/amend`)
        const res = await fetch(`http://localhost:8000/${username}/trades/amend`,
            {
                method: 'PUT',
                headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    "id": id, "username":username, "time":time, 
                    "symbol":symbol, "type":order,"side":action,"size":slotSize,
                    "price": limitOrderPrice,
                    "isExecuted": false,
                    "isClosed": false
                })
            }
        )
        const response = await res.json();
        console.log("sent PUT reqest to backend server:", response)
      } catch (error) {
        console.error('Error:', error);
    }
}