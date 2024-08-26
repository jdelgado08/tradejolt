const { alpaca } = require('../API/alpaca');
const PriceAlert = require('../models/PriceAlert');

let ws;
let isConnected = false;
let activeSymbols = new Set();

// Initialize WebSocket session
const initializeWebSocket = () => {
    if (!ws) {
        ws = alpaca.data_stream_v2;
    }

    ws.onConnect(() => {
        console.log('Connected to Alpaca WebSocket');
        isConnected = true;
    });

    ws.onDisconnect(() => {
        console.log('Disconnected from Alpaca WebSocket');
        isConnected = false;
    });

    ws.onError((err) => {
        console.error('WebSocket error:', err);
    });

    ws.onStockTrade((trade) => {
        console.log('Trade received:', trade);
        if (activeSymbols.has(trade.S)) {
            console.log(`Trade alert for symbol: ${trade.S}`);
        }
    });

    ws.connect();
};

//Sync WebSocket subscriptions with the database
const syncWebSocketSubscriptions = async () => {
    try {
        const activeAlerts = await PriceAlert.find({ isActive: true });
        const dbActiveSymbols = new Set(activeAlerts.map(alert => alert.symbol));

        // Initialize the trades array if it doesn't exist
        if (!ws.session.subscriptions) {
            ws.session.subscriptions = { trades: [] };
        }

        // Ensure the trades array exists before pushing symbols
        if (!ws.session.subscriptions.trades) {
            ws.session.subscriptions.trades = [];
        }

        // Unsubscribe symbols that are no longer active in the DB
        const symbolsToUnsubscribe = Array.from(activeSymbols).filter(symbol => !dbActiveSymbols.has(symbol));
        if (symbolsToUnsubscribe.length > 0) {
            ws.unsubscribeFromTrades(symbolsToUnsubscribe);
            symbolsToUnsubscribe.forEach(symbol => activeSymbols.delete(symbol));
            console.log(`Unsubscribed from: ${symbolsToUnsubscribe}`);
        }

        // Subscribe to symbols that are active in the DB but not yet subscribed
        const symbolsToSubscribe = Array.from(dbActiveSymbols).filter(symbol => !activeSymbols.has(symbol));
        if (symbolsToSubscribe.length > 0) {
            ws.subscribeForTrades(symbolsToSubscribe);
            symbolsToSubscribe.forEach(symbol => activeSymbols.add(symbol));
            console.log(`Subscribed to: ${symbolsToSubscribe}`);
        }

        console.log('Current active symbols:', Array.from(activeSymbols));
    } catch (error) {
        console.error('Error syncing WebSocket subscriptions:', error);
    }
};

// Stop WebSocket connection and reset
const stopWebSocket = () => {
    if (ws && isConnected) {
        ws.disconnect();
        ws = null;
        isConnected = false;
        activeSymbols.clear();
        console.log('WebSocket disconnected and reset');
    }
};

// Restore alerts from DB on server restart
const restoreActiveAlerts = async () => {
    initializeWebSocket();
    await syncWebSocketSubscriptions();
};

module.exports = {
    syncWebSocketSubscriptions,
    stopWebSocket,
    restoreActiveAlerts,
};

