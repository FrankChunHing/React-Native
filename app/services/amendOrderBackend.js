export async function amendOrderBackend(prop){
    try{
        const body = JSON.stringify({
            "id": prop.id, "user_name":prop.username, "time":prop.time, 
            "symbol":prop.symbol, "type":prop.order,"side":prop.action,"size":prop.slotSize,
            "price": prop.limitOrderPrice,
            "isExecuted": false,
            "isClosed": false
        })
        console.log("body", body)
        console.log("PUT", `http://localhost:8000/${prop.username}/trades/amend`)
        const res = await fetch(`http://localhost:8000/${prop.username}/trades/amend`,
            {
                method: 'PUT',
                headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type':'application/json'
                },
                body: body
            }
        )
        const response = await res.json();
        console.log("sent PUT reqest to backend server:", response)
      } catch (error) {
        console.error('Error:', error);
    }
}