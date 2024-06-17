export const calCashUsed = (data) => {

        let cashUsed = 0;
        data.map((trade) => {
            if (trade.order === "market"){
                 cashUsed += trade.currentPrice* trade.slotSize
            } else {
                cashUsed += trade.limitOrderPrice * trade.slotSize
            }
        })

        return cashUsed
    }
