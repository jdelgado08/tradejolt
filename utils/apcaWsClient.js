const { alpaca } = require('../API/alpaca');
const PriceAlert = require('../models/PriceAlert');
const sendEmail = require('../utils/sendEmail');
const WebSocketError = require('../errors/webSocketError');

let ws;
let isConnected = false;
let activeSymbols = new Set();

const DEBOUNCE_PERIOD_MS = 20000; //20 seconds debounce period

//initialize WebSocket session
const initializeWebSocket = () => {
    return new Promise((resolve, reject) => {
        if (!ws) {
            ws = alpaca.data_stream_v2;
        }

        ws.onConnect(() => {
            console.log('Connected to Alpaca WebSocket');
            isConnected = true;

            //ensure connectivity stability
            setTimeout(() => {
                resolve();
            }, 1000);
        });

        ws.onDisconnect(() => {
            console.log('Disconnected from Alpaca WebSocket');
            isConnected = false;
        });

        ws.onError((err) => {
            reject(new WebSocketError('WebSocket encountered an error', err));
        });

        ws.onStockTrade(async (trade) => {
            const tradeSymbol = trade.Symbol;
            console.log('Trade received:', trade);

            if (activeSymbols.has(tradeSymbol)) {
                const alerts = await PriceAlert.find({ symbol: tradeSymbol, isActive: true });
                console.log(`Found ${alerts.length} active alerts for ${tradeSymbol}`);

                for (const alert of alerts) {
                    const { priceLevel, condition, _id, userEmail, lastTriggeredAt } = alert;

                    let triggerConditionMet = false;
                    if ((condition === 'above' && trade.Price >= priceLevel) || 
                        (condition === 'below' && trade.Price <= priceLevel)) {
                        triggerConditionMet = true;
                    }

                    if (triggerConditionMet) {
                        const now = new Date();

                        //f the alert was triggered within the debounce period
                        if (lastTriggeredAt && (now - lastTriggeredAt) < DEBOUNCE_PERIOD_MS) {
                            console.log(`Skipping email for ${tradeSymbol}. Alert triggered too recently.`);
                            continue;
                        }

                        console.log(`Alert triggered for ${tradeSymbol}. Price: ${trade.Price}, Condition: ${condition}`);

                        await PriceAlert.findByIdAndUpdate(_id, { 
                            isActive: false, 
                            hasTriggered: true,
                            lastTriggeredAt: now //updt lastTriggeredAt
                        });

                        const emailContent = `
                            <p>Your alert for ${tradeSymbol} has been triggered.</p>
                            <p>Current price: ${trade.Price}</p>
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
                    }
                }
            } else {
                console.log(`Trade symbol ${tradeSymbol} is not in active subscriptions.`);
            }
        });

        ws.connect();
    });
};

//sync WebSocket subscriptions with the database
const syncWebSocketSubscriptions = async () => {
    if (!isConnected) {
        console.log('WebSocket is not connected, subscriptions will not be synced.');
        return;
    }

    const activeAlerts = await PriceAlert.find({ isActive: true });
    const dbActiveSymbols = new Set(activeAlerts.map(alert => alert.symbol));

    //ensurr subscriptions and trades array are initialized
    if (!ws.session.subscriptions) {
        ws.session.subscriptions = { trades: [] };
    } else if (!ws.session.subscriptions.trades) {
        ws.session.subscriptions.trades = [];
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
};

//stop WebSocket connection and reset
const stopWebSocket = () => {
    if (ws && isConnected) {
        ws.disconnect();
        ws = null;
        isConnected = false;
        activeSymbols.clear();
        console.log('WebSocket disconnected and reset');
    }
};

//restore alerts from DB on server restart
const restoreActiveAlerts = async () => {
    await initializeWebSocket();
    await syncWebSocketSubscriptions();
};

module.exports = {
    syncWebSocketSubscriptions,
    stopWebSocket,
    restoreActiveAlerts,
};
