
const { alpaca } = require('../API/alpaca');
const PriceAlert = require('../models/PriceAlert');
const sendEmail = require('../utils/sendEmail');

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

    ws.onStockTrade(async (trade) => {
        console.log('Trade received:', trade);

        const tradeSymbol = trade.Symbol;  // Corrected to access the symbol properly
        console.log('Current active symbols in set:', Array.from(activeSymbols));
        console.log('Trade symbol:', tradeSymbol);

        if (activeSymbols.has(tradeSymbol)) {
            console.log(`Processing trade for symbol: ${tradeSymbol}`);

            // Fetch all active alerts for this symbol
            const alerts = await PriceAlert.find({ symbol: tradeSymbol, isActive: true });
            console.log(`Found ${alerts.length} active alerts for ${tradeSymbol}`);

            for (const alert of alerts) {
                const { priceLevel, condition, _id, userEmail } = alert;

                let triggerConditionMet = false;
                if (condition === 'above' && trade.Price >= priceLevel) {  // Corrected to use trade.Price
                    triggerConditionMet = true;
                } else if (condition === 'below' && trade.Price <= priceLevel) {  // Corrected to use trade.Price
                    triggerConditionMet = true;
                }

                console.log(`Checking alert for ${tradeSymbol}:`);
                console.log(`- Trade Price: ${trade.Price}`);
                console.log(`- Alert Condition: ${condition}`);
                console.log(`- Alert Price Level: ${priceLevel}`);
                console.log(`- Trigger Condition Met: ${triggerConditionMet}`);

                if (triggerConditionMet) {
                    console.log(`Alert triggered for ${tradeSymbol}. Price: ${trade.Price}, Condition: ${condition}`);

                    // Deactivate the alert
                    await PriceAlert.findByIdAndUpdate(_id, { isActive: false, hasTriggered: true });

                    // Send email notification
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
};

// Sync WebSocket subscriptions with the database
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



//code only with error on TO
// const { alpaca } = require('../API/alpaca');
// const PriceAlert = require('../models/PriceAlert');
// const sendEmail = require('../utils/sendEmail');
// let ws;
// let isConnected = false;
// let activeSymbols = new Set();

// // Initialize WebSocket session
// const initializeWebSocket = () => {
//     if (!ws) {
//         ws = alpaca.data_stream_v2;
//     }

//     ws.onConnect(() => {
//         console.log('Connected to Alpaca WebSocket');
//         isConnected = true;
//     });

//     ws.onDisconnect(() => {
//         console.log('Disconnected from Alpaca WebSocket');
//         isConnected = false;
//     });

//     ws.onError((err) => {
//         console.error('WebSocket error:', err);
//     });

//     ws.onStockTrade(async (trade) => {
//         console.log('Trade received:', trade);
        
//         const tradeSymbol = trade.Symbol;  // Corrected to access the symbol properly
//         console.log('Current active symbols in set:', Array.from(activeSymbols));
//         console.log('Trade symbol:', trade.Symbol);
    
//         if (activeSymbols.has(trade.Symbol)) {
//             console.log(`Processing trade for symbol: ${trade.Symbol}`);
            
//             // Fetch all active alerts for this symbol
//             const alerts = await PriceAlert.find({ symbol: trade.Symbol, isActive: true });
//             console.log(`Found ${alerts.length} active alerts for ${trade.Symbol}`);
            
//             for (const alert of alerts) {
//                 const { priceLevel, condition, userId, _id, userEmail } = alert;
    
//                 let triggerConditionMet = false;
//                 if (condition === 'above' && trade.Price >= priceLevel) {  // Corrected to use trade.Price
//                     triggerConditionMet = true;
//                 } else if (condition === 'below' && trade.Price <= priceLevel) {  // Corrected to use trade.Price
//                     triggerConditionMet = true;
//                 }
    
//                 console.log(`Checking alert for ${trade.Symbol}:`);
//                 console.log(`- Trade Price: ${trade.Price}`);
//                 console.log(`- Alert Condition: ${condition}`);
//                 console.log(`- Alert Price Level: ${priceLevel}`);
//                 console.log(`- Trigger Condition Met: ${triggerConditionMet}`);
    
//                 if (triggerConditionMet) {
//                     console.log(`Alert triggered for ${trade.Symbol}. Price: ${trade.Price}, Condition: ${condition}`);
                    
//                     // Deactivate the alert
//                     await PriceAlert.findByIdAndUpdate(_id, { isActive: false, hasTriggered: true });
                    
//                     // Send email notification
//                     const emailContent = `
//                         <p>Your alert for ${trade.Symbol} has been triggered.</p>
//                         <p>Current price: ${trade.Price}</p>
//                         <p>Condition: ${condition}</p>
//                         <p>Price level: ${priceLevel}</p>
//                     `;
//                     await sendEmail(alert.userEmail, `Alert Triggered for ${trade.Symbol}`, alert.condition,emailContent);
                    
//                     console.log(`Email sent to ${alert.userEmail} for triggered alert on ${trade.Symbol}`);
//                 }
//             }
//         } else {
//             console.log(`Trade symbol ${trade.Symbol} is not in active subscriptions.`);
//         }
//     });
    
    
    
    

//     ws.connect();
// };

// // Sync WebSocket subscriptions with the database
// const syncWebSocketSubscriptions = async () => {
//     try {
//         const activeAlerts = await PriceAlert.find({ isActive: true });
//         const dbActiveSymbols = new Set(activeAlerts.map(alert => alert.symbol));

//         // Initialize the trades array if it doesn't exist
//         if (!ws.session.subscriptions) {
//             ws.session.subscriptions = { trades: [] };
//         }

//         // Ensure the trades array exists before pushing symbols
//         if (!ws.session.subscriptions.trades) {
//             ws.session.subscriptions.trades = [];
//         }

//         // Unsubscribe symbols that are no longer active in the DB
//         const symbolsToUnsubscribe = Array.from(activeSymbols).filter(symbol => !dbActiveSymbols.has(symbol));
//         if (symbolsToUnsubscribe.length > 0) {
//             ws.unsubscribeFromTrades(symbolsToUnsubscribe);
//             symbolsToUnsubscribe.forEach(symbol => activeSymbols.delete(symbol));
//             console.log(`Unsubscribed from: ${symbolsToUnsubscribe}`);
//         }

//         // Subscribe to symbols that are active in the DB but not yet subscribed
//         const symbolsToSubscribe = Array.from(dbActiveSymbols).filter(symbol => !activeSymbols.has(symbol));
//         if (symbolsToSubscribe.length > 0) {
//             ws.subscribeForTrades(symbolsToSubscribe);
//             symbolsToSubscribe.forEach(symbol => activeSymbols.add(symbol));
//             console.log(`Subscribed to: ${symbolsToSubscribe}`);
//         }

//         console.log('Current active symbols:', Array.from(activeSymbols));
//     } catch (error) {
//         console.error('Error syncing WebSocket subscriptions:', error);
//     }
// };

// // Stop WebSocket connection and reset
// const stopWebSocket = () => {
//     if (ws && isConnected) {
//         ws.disconnect();
//         ws = null;
//         isConnected = false;
//         activeSymbols.clear();
//         console.log('WebSocket disconnected and reset');
//     }
// };

// // Restore alerts from DB on server restart
// const restoreActiveAlerts = async () => {
//     initializeWebSocket();
//     await syncWebSocketSubscriptions();
// };

// module.exports = {
//     syncWebSocketSubscriptions,
//     stopWebSocket,
//     restoreActiveAlerts,
// };


// const { alpaca } = require('../API/alpaca');
// const PriceAlert = require('../models/PriceAlert');
// const sendEmail = require('../utils/sendEmail'); 
// let ws;
// let isConnected = false;
// let activeSymbols = new Set();

// // Initialize WebSocket session
// const initializeWebSocket = () => {
//     if (!ws) {
//         ws = alpaca.data_stream_v2;
//     }

//     ws.onConnect(() => {
//         console.log('Connected to Alpaca WebSocket');
//         isConnected = true;
//     });

//     ws.onDisconnect(() => {
//         console.log('Disconnected from Alpaca WebSocket');
//         isConnected = false;
//     });

//     ws.onError((err) => {
//         console.error('WebSocket error:', err);
//     });

//     ws.onStockTrade(async (trade) => {
//         console.log('Trade received:', trade);
//         if (activeSymbols.has(trade.S)) {
//             console.log(`Trade alert for symbol: ${trade.S}`);
//             // Fetch all active alerts for this symbol
//             const alerts = await PriceAlert.find({ symbol: trade.S, isActive: true });

//             for (const alert of alerts) {
//                 const { priceLevel, condition, userId, _id } = alert;

//                 let triggerConditionMet = false;
//                 if (condition === 'above' && trade.p >= priceLevel) {
//                     triggerConditionMet = true;
//                 } else if (condition === 'below' && trade.p <= priceLevel) {
//                     triggerConditionMet = true;
//                 }

//                 if (triggerConditionMet) {
//                     console.log(`Alert triggered for ${trade.S}. Price: ${trade.p}, Condition: ${condition}`);

//                     // Deactivate the alert
//                     await PriceAlert.findByIdAndUpdate(_id, { isActive: false, hasTriggered: true });

//                     // Send email notification
//                     const emailContent = `
//                         <p>Your alert for ${trade.S} has been triggered.</p>
//                         <p>Current price: ${trade.p}</p>
//                         <p>Condition: ${condition}</p>
//                         <p>Price level: ${priceLevel}</p>
//                     `;
//                     sendEmail(alert.userEmail, `Alert Triggered for ${trade.S}`, emailContent);

//                     console.log(`Email sent to ${alert.userEmail} for triggered alert on ${trade.S}`);
//                 }
//             }
//         }
//     });

//     ws.connect();
// };

// // Sync WebSocket subscriptions with the database
// const syncWebSocketSubscriptions = async () => {
//     try {
//         const activeAlerts = await PriceAlert.find({ isActive: true });
//         const dbActiveSymbols = new Set(activeAlerts.map(alert => alert.symbol));

//         // Initialize the trades array if it doesn't exist
//         if (!ws.session.subscriptions) {
//             ws.session.subscriptions = { trades: [] };
//         }

//         // Ensure the trades array exists before pushing symbols
//         if (!ws.session.subscriptions.trades) {
//             ws.session.subscriptions.trades = [];
//         }

//         // Unsubscribe symbols that are no longer active in the DB
//         const symbolsToUnsubscribe = Array.from(activeSymbols).filter(symbol => !dbActiveSymbols.has(symbol));
//         if (symbolsToUnsubscribe.length > 0) {
//             ws.unsubscribeFromTrades(symbolsToUnsubscribe);
//             symbolsToUnsubscribe.forEach(symbol => activeSymbols.delete(symbol));
//             console.log(`Unsubscribed from: ${symbolsToUnsubscribe}`);
//         }

//         // Subscribe to symbols that are active in the DB but not yet subscribed
//         const symbolsToSubscribe = Array.from(dbActiveSymbols).filter(symbol => !activeSymbols.has(symbol));
//         if (symbolsToSubscribe.length > 0) {
//             ws.subscribeForTrades(symbolsToSubscribe);
//             symbolsToSubscribe.forEach(symbol => activeSymbols.add(symbol));
//             console.log(`Subscribed to: ${symbolsToSubscribe}`);
//         }

//         console.log('Current active symbols:', Array.from(activeSymbols));
//     } catch (error) {
//         console.error('Error syncing WebSocket subscriptions:', error);
//     }
// };

// // Stop WebSocket connection and reset
// const stopWebSocket = () => {
//     if (ws && isConnected) {
//         ws.disconnect();
//         ws = null;
//         isConnected = false;
//         activeSymbols.clear();
//         console.log('WebSocket disconnected and reset');
//     }
// };

// // Restore alerts from DB on server restart
// const restoreActiveAlerts = async () => {
//     initializeWebSocket();
//     await syncWebSocketSubscriptions();
// };

// module.exports = {
//     syncWebSocketSubscriptions,
//     stopWebSocket,
//     restoreActiveAlerts,
// };
