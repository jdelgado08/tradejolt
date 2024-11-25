const { alpaca } = require('../API/alpaca');
const PriceAlert = require('../models/PriceAlert');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

let ws;
let isConnected = false;
let activeSymbols = new Set();
let tradeBuffer = []; //Buffer to store incoming trades
let processingInterval; //Timer for chunked processing

const PROCESS_INTERVAL_MS = 3000; //3 seconds
const DEBOUNCE_PERIOD_MS = 20000; //20 seconds debounce period

const initializeWebSocket = async () => {
    if (!ws) {
        ws = alpaca.data_stream_v2;
    }

    return new Promise((resolve, reject) => {
        ws.onConnect(() => {
            console.log('Connected to Alpaca WebSocket');
            isConnected = true;
            setTimeout(() => resolve(), 1000);
        });

        ws.onDisconnect(() => {
            console.log('Disconnected from Alpaca WebSocket');
            isConnected = false;
        });

        ws.onError((err) => {
            reject(err);
        });

        ws.onStockTrade((trade) => {
            // Add trade data to the buffer
            tradeBuffer.push(trade);
        });

        if (!isConnected) {
            ws.connect();
        }
    });
};

const processTrades = async () => {
    if (tradeBuffer.length === 0) return;

    const tradesToProcess = [...tradeBuffer];
    tradeBuffer = []; // Clear the buffer after copying

    const activeAlerts = await PriceAlert.find({ isActive: true });
    if (activeAlerts.length === 0) {
        console.log('No active alerts. Stopping WebSocket...');
        stopWebSocket(); // Disconnect WebSocket if no active alerts
        return;
    }

    for (const trade of tradesToProcess) {
        const { Symbol: tradeSymbol, Price: tradePrice } = trade;

        const matchingAlerts = activeAlerts.filter(alert => alert.symbol === tradeSymbol);
        for (const alert of matchingAlerts) {
            const { priceLevel, condition, _id, lastTriggeredAt } = alert;

            const user = await User.findById(alert.userId);
            const userEmail = user?.email;
            if (!userEmail) continue;

            let triggerConditionMet = false;
            if ((condition === 'above' && tradePrice >= priceLevel) || 
                (condition === 'below' && tradePrice <= priceLevel)) {
                triggerConditionMet = true;
            }

            if (triggerConditionMet) {
                const now = new Date();

                if (lastTriggeredAt && (now - lastTriggeredAt) < DEBOUNCE_PERIOD_MS) {
                    console.log(`Skipping alert for ${tradeSymbol}. Triggered too recently.`);
                    continue;
                }

                console.log(`Alert triggered for ${tradeSymbol}. Price: ${tradePrice}, Condition: ${condition}`);

                await PriceAlert.findByIdAndUpdate(_id, { 
                    isActive: false, 
                    hasTriggered: true,
                    lastTriggeredAt: now 
                });

                const emailContent = `
                    <p>Your alert for ${tradeSymbol} has been triggered.</p>
                    <p>Current price: ${tradePrice}</p>
                    <p>Condition: ${condition}</p>
                    <p>Price level: ${priceLevel}</p>
                `;
                
                await sendEmail({ 
                    to: userEmail, 
                    subject: `Alert Triggered for ${tradeSymbol}`, 
                    text: `Your alert for ${tradeSymbol} has been triggered.`,
                    html: emailContent 
                });

                console.log(`Email sent to ${userEmail} for triggered alert on ${tradeSymbol}`);

                // Stop further processing for this buffer
                return;
            }
        }
    }
};

const startProcessing = () => {
    if (processingInterval) return;

    processingInterval = setInterval(processTrades, PROCESS_INTERVAL_MS);
    console.log('Started processing trades in chunks.');
};

const stopWebSocket = () => {
    if (processingInterval) {
        clearInterval(processingInterval);
        processingInterval = null;
    }

    if (ws && isConnected) {
        console.log('WebSocket disconnected and reset due to no active alerts.');
        ws.unsubscribeFromTrades([...activeSymbols]);
        ws.disconnect();
        isConnected = false;
    }

    ws = null;
    activeSymbols.clear();
};

const syncWebSocketSubscriptions = async () => {
    const activeAlerts = await PriceAlert.find({ isActive: true });
    const dbActiveSymbols = new Set(activeAlerts.map(alert => alert.symbol));

    if (dbActiveSymbols.size === 0) {
        console.log('No active alerts found. Disconnecting WebSocket...');
        stopWebSocket();
        return;
    }

    if (!isConnected) {
        console.log('WebSocket is not connected. Reinitializing...');
        await initializeWebSocket();
    }

    const symbolsToUnsubscribe = Array.from(activeSymbols).filter(symbol => !dbActiveSymbols.has(symbol));
    if (symbolsToUnsubscribe.length > 0) {
        ws.unsubscribeFromTrades(symbolsToUnsubscribe);
        symbolsToUnsubscribe.forEach(symbol => activeSymbols.delete(symbol));
        console.log(`Unsubscribed from: ${symbolsToUnsubscribe}`);
    }

    const symbolsToSubscribe = Array.from(dbActiveSymbols).filter(symbol => !activeSymbols.has(symbol));
    if (symbolsToSubscribe.length > 0) {
        ws.subscribeForTrades(symbolsToSubscribe);
        symbolsToSubscribe.forEach(symbol => activeSymbols.add(symbol));
        console.log(`Subscribed to: ${symbolsToSubscribe}`);
    }

    console.log('Current active symbols:', Array.from(activeSymbols));
    startProcessing();
};

const restoreActiveAlerts = async () => {
    await initializeWebSocket();
    await syncWebSocketSubscriptions();
};

process.on('SIGINT', stopWebSocket);
process.on('SIGTERM', stopWebSocket);

module.exports = {
    syncWebSocketSubscriptions,
    stopWebSocket,
    restoreActiveAlerts,
};