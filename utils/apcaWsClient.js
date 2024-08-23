const { alpaca } = require('../API/alpaca');

let ws; //webSocket instance
let isConnected = false; //connection state
let subscribedSymbols = new Set(); // track of subscribed symbols

//subscribe symbol
const subscribeToStockPrice = (symbols, priceCallback) => {
    if (!ws) {
        ws = alpaca.data_stream_v2; //initialize WebSocket if not already done
    }

    ws.onConnect(() => {
        console.log('Connected to Alpaca WebSocket');
        isConnected = true; 

        const symbolsToSubscribe = symbols.filter(symbol => !subscribedSymbols.has(symbol));

        if (symbolsToSubscribe.length > 0) {
            ws.subscribeForTrades(symbolsToSubscribe); //subscribe to trade updates for symbols
            symbolsToSubscribe.forEach(symbol => subscribedSymbols.add(symbol));
            console.log(`Subscribed to trades for: ${symbolsToSubscribe.join(', ')}`);
        } else {
            console.log('No new symbols to subscribe.');
        }
    });

    ws.onError((err) => {
        console.error('WebSocket error: ', err);
    });

    ws.onDisconnect(() => {
        console.log('Disconnected from Alpaca WebSocket');
        isConnected = false; // Set connected state to false
    });

    //receiving trade data
    ws.onStockTrade((trade) => {
        console.log('Trade received:', trade);
        if (subscribedSymbols.has(trade.S)) {
            priceCallback(trade); //callback with trade data
        }
    });

    if (!isConnected) {
        ws.connect();
    } else {
        ws.onConnect();
    }
};

// Unsubscribe symbol
const unsubscribeStockPrice = (symbols) => {
    if (!ws) {
        console.error('WebSocket is not initialized.');
        return;
    }

    const symbolsToUnsubscribe = symbols.filter(symbol => subscribedSymbols.has(symbol));

    if (symbolsToUnsubscribe.length > 0) {
        ws.unsubscribeFromTrades(symbolsToUnsubscribe); 
        symbolsToUnsubscribe.forEach(symbol => subscribedSymbols.delete(symbol));
        console.log(`Unsubscribed from trades for: ${symbolsToUnsubscribe.join(', ')}`);
    } else {
        console.log('No symbols to unsubscribe.');
    }
};

//stop connection
const stopWs = () => {
    if (ws) {
        ws.disconnect(); // Disconnect the WebSocket
        console.log('WebSocket disconnected');
        ws = null; //reset ws
        isConnected = false; //reset state
        subscribedSymbols.clear(); //clear all subs
    }
};

module.exports = {
    subscribeToStockPrice,   
    unsubscribeStockPrice,    
    stopWs,        

};

