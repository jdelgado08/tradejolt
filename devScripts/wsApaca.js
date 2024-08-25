const { alpaca } = require('../API/alpaca'); // Importing Alpaca connection
const PriceAlert = require('../models/PriceAlert');

let ws; // WebSocket instance
let isConnected = false; // Connection state
let subscribedSymbols = new Set(); // Track subscribed symbols

// Subscribe to stock price
const subscribeToStockPrice = (userAlerts, priceCallback) => {
    if (!ws) {
        ws = alpaca.data_stream_v2; // Initialize WebSocket if not already done
    }

    const symbols = userAlerts.map(alert => alert.symbol); // Get unique symbols from userAlerts

    if (symbols.length === 0) {
        console.log('No active price alerts for this user. Not subscribing to anything.');
        return;
    }

    // If not connected, set up WebSocket events
    if (!isConnected) {
        ws.onConnect(() => {
            console.log('Connected to Alpaca WebSocket');
            isConnected = true;

            const symbolsToSubscribe = symbols.filter(symbol => !subscribedSymbols.has(symbol));

            if (symbolsToSubscribe.length > 0) {
                ws.subscribeForTrades(symbolsToSubscribe); // Subscribe to trade updates for symbols
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

        // Receiving trade data
        ws.onStockTrade((trade) => {
            if (subscribedSymbols.has(trade.S)) {
                priceCallback(trade); // Callback with trade data
            }
        });

        // Connect to WebSocket
        ws.connect();
    } else {
        // If already connected, subscribe to new symbols directly
        const symbolsToSubscribe = symbols.filter(symbol => !subscribedSymbols.has(symbol));

        if (symbolsToSubscribe.length > 0) {
            ws.subscribeForTrades(symbolsToSubscribe); // Subscribe to trade updates for new symbols
            symbolsToSubscribe.forEach(symbol => subscribedSymbols.add(symbol));
            console.log(`Subscribed to trades for: ${symbolsToSubscribe.join(', ')}`);
        } else {
            console.log('No new symbols to subscribe.');
        }
    }
};

// Unsubscribe from stock price
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

        // If no more symbols are subscribed, consider stopping the WebSocket connection
        if (subscribedSymbols.size === 0) {
            console.log('No more symbols subscribed. Disconnecting WebSocket.');
            stopWs(); // Stop the WebSocket connection if no symbols are left
        }
    } else {
        console.log('No symbols to unsubscribe.');
    }
};

// Stop WebSocket connection
const stopWs = () => {
    if (ws) {
        ws.disconnect(); // Disconnect the WebSocket
        console.log('WebSocket disconnected');
        ws = null; // Reset ws
        isConnected = false; // Reset state
        subscribedSymbols.clear(); // Clear all subscriptions
    }
};

// Restore alerts from DB on server restart
const restoreActiveAlerts = async () => {
    try {
        const activeAlerts = await PriceAlert.find({ isActive: true }); // Fetch all active alerts from DB
        const userAlertsMap = {}; // Group alerts by user

        activeAlerts.forEach(alert => {
            if (!userAlertsMap[alert.userId]) {
                userAlertsMap[alert.userId] = [];
            }
            userAlertsMap[alert.userId].push(alert);
        });

        Object.keys(userAlertsMap).forEach(userId => {
            subscribeToStockPrice(userAlertsMap[userId], (trade) => {
                console.log(`Trade alert for user ${userId}:`, trade);
            });
        });
    } catch (error) {
        console.error('Error restoring active alerts:', error);
    }
};

module.exports = {
    subscribeToStockPrice,   
    unsubscribeStockPrice,    
    stopWs,     
    restoreActiveAlerts,
};
