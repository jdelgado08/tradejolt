const PriceAlert = require('../models/PriceAlert');
const { subscribeToStockPrice, unsubscribeStockPrice } = require('../utils/apcaWsClient');

// Create a new price alert
const createPriceAlert = async (req, res) => {
    const { symbol, priceLevel, condition } = req.body;

    // Validate inputs
    if (!symbol || !priceLevel || !condition) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    const userId = req.user.userId;

    try {
        const newAlert = await PriceAlert.create({
            userId,
            symbol,
            priceLevel,
            condition
        });

        // Fetch user's active alerts
        const userAlerts = await PriceAlert.find({ userId, isActive: true });

        // Subscribe to stock price alerts for user's active alerts
        subscribeToStockPrice(userAlerts, (trade) => {
            console.log('Price alert triggered:', trade);
        });

        res.status(201).json(newAlert);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Failed to create price alert' });
    }
};

// Get all price alerts for the user
const getPriceAlerts = async (req, res) => {
    const userId = req.user.userId;
    const alerts = await PriceAlert.find({ userId });
    res.status(200).json(alerts);
};

// Delete a price alert
const deletePriceAlert = async (req, res) => {
    const { id: alertId } = req.params;
    const userId = req.user.userId;

    try {
        const alert = await PriceAlert.findOne({
            _id: alertId,
            userId: userId
        });

        if (!alert) {
            return res.status(404).json({ msg: 'Alert not found or unauthorized' });
        }

        await PriceAlert.deleteOne({ _id: alertId, userId: userId });

        unsubscribeStockPrice([alert.symbol]);

        res.status(200).json({ msg: 'Price alert deleted successfully' });
    } catch (error) {
        console.error('Error while deleting alert:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Update a price alert
const updatePriceAlert = async (req, res) => {
    const { id } = req.params;
    const { priceLevel, condition, isActive } = req.body;

    const alert = await PriceAlert.findById(id);

    if (!alert) {
        return res.status(404).json({ msg: 'Price alert not found' });
    }

    const wasActive = alert.isActive;

    alert.priceLevel = priceLevel !== undefined ? priceLevel : alert.priceLevel;
    alert.condition = condition !== undefined ? condition : alert.condition;
    alert.isActive = isActive !== undefined ? isActive : alert.isActive;

    await alert.save();

    if (wasActive && !alert.isActive) {
        unsubscribeStockPrice([alert.symbol]);
    } else if (!wasActive && alert.isActive) {
        const updatedAlert = await PriceAlert.findById(id);

        const userAlerts = await PriceAlert.find({ userId: req.user.userId, isActive: true });

        subscribeToStockPrice(userAlerts, (trade) => {
            console.log('Price alert triggered:', trade);
        });
    }

    res.status(200).json(alert);
};

module.exports = {
    createPriceAlert,
    getPriceAlerts,
    deletePriceAlert,
    updatePriceAlert
};



// wsAlpaca

const { alpaca } = require('../API/alpaca');
const PriceAlert = require('../models/PriceAlert');

let ws;
let isConnected = false;
let subscribedSymbols = new Set();

// Initialize WebSocket session
const initializeSession = () => {
    if (!ws.session.subscriptions) {
        ws.session.subscriptions = { trades: [] };
    }
};

// Subscribe to stock price
const subscribeToStockPrice = (userAlerts, priceCallback) => {
    if (!ws) {
        ws = alpaca.data_stream_v2;
    }

    initializeSession();

    const symbols = userAlerts.map(alert => alert.symbol);

    if (symbols.length === 0) {
        console.log('No active price alerts to subscribe.');
        return;
    }

    const symbolsToSubscribe = symbols.filter(symbol => !subscribedSymbols.has(symbol));

    if (symbolsToSubscribe.length > 0) {
        if (!isConnected) {
            ws.onConnect(() => {
                isConnected = true;
                initializeSession();
                ws.subscribeForTrades(symbolsToSubscribe);
                symbolsToSubscribe.forEach(symbol => subscribedSymbols.add(symbol));
            });

            ws.onStockTrade((trade) => {
                if (subscribedSymbols.has(trade.S)) {
                    priceCallback(trade);
                }
            });

            ws.onError((err) => {
                console.error('WebSocket error:', err);
            });

            ws.onDisconnect(() => {
                isConnected = false;
            });

            ws.connect();
        } else {
            ws.subscribeForTrades(symbolsToSubscribe);
            symbolsToSubscribe.forEach(symbol => subscribedSymbols.add(symbol));
        }
    }
};

// Unsubscribe from stock price
const unsubscribeStockPrice = async (symbols) => {
    if (!ws) return;

    const symbolsToUnsubscribe = symbols.filter(symbol => subscribedSymbols.has(symbol));

    if (symbolsToUnsubscribe.length > 0) {
        ws.unsubscribeFromTrades(symbolsToUnsubscribe);
        symbolsToUnsubscribe.forEach(symbol => subscribedSymbols.delete(symbol));

        if (subscribedSymbols.size === 0) {
            stopWs();
        }
    }
};

// Stop WebSocket connection
const stopWs = () => {
    if (ws) {
        ws.disconnect();
        ws = null;
        isConnected = false;
        subscribedSymbols.clear();
    }
};

// Restore alerts from DB on server restart
const restoreActiveAlerts = async () => {
    try {
        const activeAlerts = await PriceAlert.find({ isActive: true });
        const userAlertsMap = {};

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
    restoreActiveAlerts
};



