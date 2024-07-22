export async function deleteTradeAndOrderBackend(username, id){
    
        try{
            const res = await fetch(`http://localhost:8000/${username}/trades/delete`,
                {
                    method: 'DELETE',
                    headers: {
                                'Access-Control-Allow-Origin': '*',
                                'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        "id": id, 
                    })
                }
            )
            const response = await res.json();
            console.log("sent DELETE reqest to backend server:", response)
          } catch (error) {
            console.error('Error:', error);
        }
}