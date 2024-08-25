const { alpaca } = require('../API/alpaca'); 
const PriceAlert = require('../models/PriceAlert');

let ws; 
let isConnected = false; // Connection state
let subscribedSymbols = new Set(); // Track subscribed symbols

// Initialize WebSocket session
const initializeSession = () => {
    if (!ws.session.subscriptions) {
        ws.session.subscriptions = { trades: [] };
        console.log('Initialized WebSocket session subscriptions.');
    }
};

// Subscribe to stock price
const subscribeToStockPrice = (userAlerts, priceCallback) => {
    if (!ws) {
        ws = alpaca.data_stream_v2;
        console.log('Created new Alpaca WebSocket instance.');
    }

    // Initialize the WebSocket session if necessary
    initializeSession();

    const symbols = userAlerts.map(alert => alert.symbol); //Get unique symbols from userAlerts
    console.log(`Symbols derived from userAlerts: ${symbols}`);

    if (symbols.length === 0) {
        console.log('No active price alerts for this user. Not subscribing to anything.');
        return;
    }

    const symbolsToSubscribe = symbols.filter(symbol => !subscribedSymbols.has(symbol));
    console.log(`Symbols to subscribe: ${symbolsToSubscribe}`);

    if (symbolsToSubscribe.length > 0) {
        if (!isConnected) {
            console.log('Subscribing to Alpaca WebSocket...');
            ws.onConnect(() => {
                console.log('Connected to Alpaca WebSocket');
                isConnected = true;

                initializeSession(); //Ensure session subscriptions are initialized properly

                ws.subscribeForTrades(symbolsToSubscribe); //Subscribe to trade updates for symbols
                symbolsToSubscribe.forEach(symbol => subscribedSymbols.add(symbol));
                console.log(`Subscribed to trades for: ${symbolsToSubscribe.join(', ')}`);
            });

            ws.onError((err) => {
                console.error('WebSocket error: ', err);
            });

            ws.onDisconnect(() => {
                console.log('Disconnected from Alpaca WebSocket');
                isConnected = false;
            });

            ws.onStockTrade((trade) => {
                console.log('Trade received:', trade);
                if (subscribedSymbols.has(trade.S)) {
                    priceCallback(trade); //Callback with trade data
                }
            });

            ws.connect(); //Initiate WebSocket connection
        } else {
            ws.subscribeForTrades(symbolsToSubscribe); //Subscribe to trade updates for new symbols
            symbolsToSubscribe.forEach(symbol => subscribedSymbols.add(symbol));
            console.log(`Subscribed to trades for: ${symbolsToSubscribe.join(', ')}`);
        }
    } else {
        console.log('No new symbols to subscribe.');
    }
};

//Unsubscribe from stock price
const unsubscribeStockPrice = async (symbols) => {
    if (!ws) {
        console.error('WebSocket is not initialized.');
        return;
    }

    const symbolsToUnsubscribe = symbols.filter(symbol => subscribedSymbols.has(symbol));
    console.log(`Symbols to unsubscribe: ${symbolsToUnsubscribe}`);

    if (symbolsToUnsubscribe.length > 0) {
        ws.unsubscribeFromTrades(symbolsToUnsubscribe);
        symbolsToUnsubscribe.forEach(symbol => subscribedSymbols.delete(symbol));
        console.log(`Unsubscribed from trades for: ${symbolsToUnsubscribe.join(', ')}`);

        //If no more symbols are subscribed, stop the WebSocket connection
        if (subscribedSymbols.size === 0) {
            console.log('No more symbols subscribed. Stopping WebSocket.');
            stopWs();
        }
    } else {
        console.log('No symbols to unsubscribe.');
    }
};

//Stop WebSocket connection
const stopWs = () => {
    if (ws) {
        ws.disconnect(); 
        console.log('WebSocket disconnected');
        ws = null; //Reset ws
        isConnected = false; //Reset state
        subscribedSymbols.clear(); //Clear all subscriptions
        console.log('Cleared all subscriptions.');
    }
};

// Restore alerts from DB on server restart
const restoreActiveAlerts = async () => {
    try {
        const activeAlerts = await PriceAlert.find({ isActive: true }); //Fetch all active alerts from DB
        const userAlertsMap = {}; //Group alerts by user

        activeAlerts.forEach(alert => {
            if (!userAlertsMap[alert.userId]) {
                userAlertsMap[alert.userId] = [];
            }
            userAlertsMap[alert.userId].push(alert);
        });

        Object.keys(userAlertsMap).forEach(userId => {
            console.log(`Restoring alerts for user ${userId}.`);
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




// const { alpaca } = require('../API/alpaca');
// const PriceAlert = require('../models/PriceAlert');

// let ws;
// let isConnected = false;
// let subscribedSymbols = new Set(); // Track subscribed symbols

// // Initialize WebSocket session
// const initializeSession = () => {
//     if (!ws.session.subscriptions) {
//         ws.session.subscriptions = { trades: [] };
//     }
// };

// // Subscribe to stock price
// const subscribeToStockPrice = async (userAlerts, priceCallback) => {
//     if (!ws) {
//         ws = alpaca.data_stream_v2;
//     }

//     initializeSession();

//     const symbols = userAlerts.map(alert => alert.symbol);
//     const symbolsToSubscribe = symbols.filter(symbol => !subscribedSymbols.has(symbol));

//     if (symbolsToSubscribe.length === 0) {
//         console.log('No new symbols to subscribe.');
//         return;
//     }

//     if (!isConnected) {
//         ws.onConnect(() => {
//             console.log('Connected to Alpaca WebSocket');
//             isConnected = true;

//             initializeSession();

//             try {
//                 if (!ws.session.subscriptions.trades) {
//                     ws.session.subscriptions.trades = [];
//                 }

//                 ws.subscribeForTrades(symbolsToSubscribe);
//                 symbolsToSubscribe.forEach(symbol => subscribedSymbols.add(symbol));
//                 console.log(`Subscribed to trades for: ${symbolsToSubscribe.join(', ')}`);
//             } catch (err) {
//                 console.error('Error during subscribeForTrades:', err);
//             }
//         });

//         ws.onError((err) => {
//             console.error('WebSocket error: ', err);
//         });

//         ws.onDisconnect(() => {
//             console.log('Disconnected from Alpaca WebSocket');
//             isConnected = false;
//         });

//         ws.onStockTrade((trade) => {
//             console.log('Trade received:', trade);
//             if (subscribedSymbols.has(trade.S)) {
//                 priceCallback(trade);
//             }
//         });

//         ws.connect();
//     } else {
//         try {
//             if (!ws.session.subscriptions.trades) {
//                 ws.session.subscriptions.trades = [];
//             }

//             ws.subscribeForTrades(symbolsToSubscribe);
//             symbolsToSubscribe.forEach(symbol => subscribedSymbols.add(symbol));
//             console.log(`Subscribed to trades for: ${symbolsToSubscribe.join(', ')}`);
//         } catch (err) {
//             console.error('Error during subscribeForTrades:', err);
//         }
//     }
// };

// // Unsubscribe from stock price
// const unsubscribeStockPrice = async (symbols) => {
//     if (!ws) {
//         console.error('WebSocket is not initialized.');
//         return;
//     }

//     const symbolsToUnsubscribe = symbols.filter(symbol => subscribedSymbols.has(symbol));

//     if (symbolsToUnsubscribe.length > 0) {
//         ws.unsubscribeFromTrades(symbolsToUnsubscribe);
//         symbolsToUnsubscribe.forEach(symbol => subscribedSymbols.delete(symbol));
//         console.log(`Unsubscribed from trades for: ${symbolsToUnsubscribe.join(', ')}`);

//         if (subscribedSymbols.size === 0) {
//             stopWs();
//         }
//     } else {
//         console.log('No symbols to unsubscribe.');
//     }
// };

// // Stop WebSocket connection
// const stopWs = () => {
//     if (ws) {
//         ws.disconnect();
//         console.log('WebSocket disconnected');
//         ws = null;
//         isConnected = false;
//         subscribedSymbols.clear();
//     }
// };

// // Restore alerts from DB on server restart
// const restoreActiveAlerts = async () => {
//     try {
//         const activeAlerts = await PriceAlert.find({ isActive: true });
//         const userAlertsMap = {};

//         activeAlerts.forEach(alert => {
//             if (!userAlertsMap[alert.userId]) {
//                 userAlertsMap[alert.userId] = [];
//             }
//             userAlertsMap[alert.userId].push(alert);
//         });

//         Object.keys(userAlertsMap).forEach(userId => {
//             subscribeToStockPrice(userAlertsMap[userId], (trade) => {
//                 console.log(`Trade alert for user ${userId}:`, trade);
//             });
//         });
//     } catch (error) {
//         console.error('Error restoring active alerts:', error);
//     }
// };

// module.exports = {
//     subscribeToStockPrice,
//     unsubscribeStockPrice,
//     stopWs,
//     restoreActiveAlerts,
// };



// const { alpaca } = require('../API/alpaca'); // Importing Alpaca connection
// const PriceAlert = require('../models/PriceAlert');

// let ws; // WebSocket instance
// let isConnected = false; // Connection state
// let subscribedSymbols = new Set(); // Track subscribed symbols

// // Initialize WebSocket session
// const initializeSession = () => {
//     if (!ws.session.subscriptions) {
//         ws.session.subscriptions = { trades: [] };
//     }
// };

// // Subscribe to stock price
// const subscribeToStockPrice = async (userAlerts, priceCallback) => {
//     if (!ws) {
//         ws = alpaca.data_stream_v2; // Initialize WebSocket if not already done
//     }

//     // Initialize the WebSocket session if necessary
//     initializeSession();

//     const symbols = userAlerts.map(alert => alert.symbol); // Get unique symbols from userAlerts

//     if (symbols.length === 0) {
//         console.log('No active price alerts for this user. Not subscribing to anything.');
//         return;
//     }

//     const symbolsToSubscribe = symbols.filter(symbol => !subscribedSymbols.has(symbol));

//     if (symbolsToSubscribe.length > 0) {
//         if (!isConnected) {
//             // If the WebSocket is not connected, reconnect before subscribing
//             ws.onConnect(() => {
//                 console.log('Connected to Alpaca WebSocket');
//                 isConnected = true;

//                 // Ensure session subscriptions are initialized properly
//                 initializeSession();

//                 try {
//                     // Safeguard against uninitialized subscription arrays
//                     if (!ws.session.subscriptions.trades) {
//                         ws.session.subscriptions.trades = [];
//                     }

//                     ws.subscribeForTrades(symbolsToSubscribe); // Subscribe to trade updates for symbols
//                     symbolsToSubscribe.forEach(symbol => subscribedSymbols.add(symbol));
//                     console.log(`Subscribed to trades for: ${symbolsToSubscribe.join(', ')}`);
//                 } catch (err) {
//                     console.error('Error during subscribeForTrades:', err);
//                 }
//             });

//             ws.onError((err) => {
//                 console.error('WebSocket error: ', err);
//             });

//             ws.onDisconnect(() => {
//                 console.log('Disconnected from Alpaca WebSocket');
//                 isConnected = false; // Set connected state to false
//             });

//             ws.onStockTrade((trade) => {
//                 console.log('Trade received:', trade);
//                 if (subscribedSymbols.has(trade.S)) {
//                     priceCallback(trade); // Callback with trade data
//                 }
//             });

//             ws.connect(); // Reconnect the WebSocket
//         } else {
//             try {
//                 // Ensure session subscriptions are initialized properly before subscribing
//                 if (!ws.session.subscriptions.trades) {
//                     ws.session.subscriptions.trades = [];
//                 }

//                 ws.subscribeForTrades(symbolsToSubscribe); // Subscribe to trade updates for new symbols
//                 symbolsToSubscribe.forEach(symbol => subscribedSymbols.add(symbol));
//                 console.log(`Subscribed to trades for: ${symbolsToSubscribe.join(', ')}`);
//             } catch (err) {
//                 console.error('Error during subscribeForTrades:', err);
//             }
//         }
//     } else {
//         console.log('No new symbols to subscribe.');
//     }
// };

// // Unsubscribe from stock price
// const unsubscribeStockPrice = async (symbols) => {
//     if (!ws) {
//         console.error('WebSocket is not initialized.');
//         return;
//     }

//     const symbolsToUnsubscribe = symbols.filter(symbol => subscribedSymbols.has(symbol));

//     if (symbolsToUnsubscribe.length > 0) {
//         ws.unsubscribeFromTrades(symbolsToUnsubscribe); 
//         symbolsToUnsubscribe.forEach(symbol => subscribedSymbols.delete(symbol));
//         console.log(`Unsubscribed from trades for: ${symbolsToUnsubscribe.join(', ')}`);

//         // If no more symbols are subscribed, stop the WebSocket connection
//         if (subscribedSymbols.size === 0) {
//             stopWs(); // Stop the WebSocket connection if no symbols are left
//         }
//     } else {
//         console.log('No symbols to unsubscribe.');
//     }
// };

// // Stop WebSocket connection
// const stopWs = () => {
//     if (ws) {
//         ws.disconnect(); // Disconnect the WebSocket
//         console.log('WebSocket disconnected');
//         ws = null; // Reset ws
//         isConnected = false; // Reset state
//         subscribedSymbols.clear(); // Clear all subscriptions
//     }
// };

// // Restore alerts from DB on server restart
// const restoreActiveAlerts = async () => {
//     try {
//         const activeAlerts = await PriceAlert.find({ isActive: true }); // Fetch all active alerts from DB
//         const userAlertsMap = {}; // Group alerts by user

//         activeAlerts.forEach(alert => {
//             if (!userAlertsMap[alert.userId]) {
//                 userAlertsMap[alert.userId] = [];
//             }
//             userAlertsMap[alert.userId].push(alert);
//         });

//         Object.keys(userAlertsMap).forEach(userId => {
//             subscribeToStockPrice(userAlertsMap[userId], (trade) => {
//                 console.log(`Trade alert for user ${userId}:`, trade);
//             });
//         });
//     } catch (error) {
//         console.error('Error restoring active alerts:', error);
//     }
// };

// module.exports = {
//     subscribeToStockPrice,   
//     unsubscribeStockPrice,    
//     stopWs,     
//     restoreActiveAlerts,
// };















// //work with small bugg, so berwst attentp so far

// const { alpaca } = require('../API/alpaca'); // Importing Alpaca connection
// const PriceAlert = require('../models/PriceAlert');

// let ws; // WebSocket instance
// let isConnected = false; // Connection state
// let subscribedSymbols = new Set(); // Track subscribed symbols

// // Initialize WebSocket session
// const initializeSession = () => {
//     if (!ws.session.subscriptions) {
//         ws.session.subscriptions = { trades: [] };
//     }
// };

// // Subscribe to stock price
// const subscribeToStockPrice = (userAlerts, priceCallback) => {
//     if (!ws) {
//         ws = alpaca.data_stream_v2; // Initialize WebSocket if not already done
//     }

//     // Initialize the WebSocket session if necessary
//     initializeSession();

//     const symbols = userAlerts.map(alert => alert.symbol); // Get unique symbols from userAlerts

//     if (symbols.length === 0) {
//         console.log('No active price alerts for this user. Not subscribing to anything.');
//         return;
//     }

//     const symbolsToSubscribe = symbols.filter(symbol => !subscribedSymbols.has(symbol));

//     if (symbolsToSubscribe.length > 0) {
//         if (!isConnected) {
//             // If the WebSocket is not connected, reconnect before subscribing
//             ws.onConnect(() => {
//                 console.log('Connected to Alpaca WebSocket');
//                 isConnected = true;

//                 // Ensure session subscriptions are initialized properly
//                 initializeSession();

//                 try {
//                     // Safeguard against uninitialized subscription arrays
//                     if (!ws.session.subscriptions.trades) {
//                         ws.session.subscriptions.trades = [];
//                     }

//                     ws.subscribeForTrades(symbolsToSubscribe); // Subscribe to trade updates for symbols
//                     symbolsToSubscribe.forEach(symbol => subscribedSymbols.add(symbol));
//                     console.log(`Subscribed to trades for: ${symbolsToSubscribe.join(', ')}`);
//                 } catch (err) {
//                     console.error('Error during subscribeForTrades:', err);
//                 }
//             });

//             ws.onError((err) => {
//                 console.error('WebSocket error: ', err);
//             });

//             ws.onDisconnect(() => {
//                 console.log('Disconnected from Alpaca WebSocket');
//                 isConnected = false; // Set connected state to false
//             });

//             ws.onStockTrade((trade) => {
//                 console.log('Trade received:', trade);
//                 if (subscribedSymbols.has(trade.S)) {
//                     priceCallback(trade); // Callback with trade data
//                 }
//             });

//             ws.connect(); // Reconnect the WebSocket
//         } else {
//             try {
//                 // Ensure session subscriptions are initialized properly before subscribing
//                 if (!ws.session.subscriptions.trades) {
//                     ws.session.subscriptions.trades = [];
//                 }

//                 ws.subscribeForTrades(symbolsToSubscribe); // Subscribe to trade updates for new symbols
//                 symbolsToSubscribe.forEach(symbol => subscribedSymbols.add(symbol));
//                 console.log(`Subscribed to trades for: ${symbolsToSubscribe.join(', ')}`);
//             } catch (err) {
//                 console.error('Error during subscribeForTrades:', err);
//             }
//         }
//     } else {
//         console.log('No new symbols to subscribe.');
//     }
// };


// // Unsubscribe from stock price
// const unsubscribeStockPrice = async (symbols) => {
//     if (!ws) {
//         console.error('WebSocket is not initialized.');
//         return;
//     }

//     const symbolsToUnsubscribe = symbols.filter(symbol => subscribedSymbols.has(symbol));

//     if (symbolsToUnsubscribe.length > 0) {
//         ws.unsubscribeFromTrades(symbolsToUnsubscribe); 
//         symbolsToUnsubscribe.forEach(symbol => subscribedSymbols.delete(symbol));
//         console.log(`Unsubscribed from trades for: ${symbolsToUnsubscribe.join(', ')}`);

//         // If no more symbols are subscribed, consider stopping the WebSocket connection
//         if (subscribedSymbols.size === 0) {
//             stopWs(); // Stop the WebSocket connection if no symbols are left
//         }
//     } else {
//         console.log('No symbols to unsubscribe.');
//     }
// };

// // Stop WebSocket connection
// const stopWs = () => {
//     if (ws) {
//         ws.disconnect(); // Disconnect the WebSocket
//         console.log('WebSocket disconnected');
//         ws = null; // Reset ws
//         isConnected = false; // Reset state
//         subscribedSymbols.clear(); // Clear all subscriptions
//     }
// };

// // Restore alerts from DB on server restart
// const restoreActiveAlerts = async () => {
//     try {
//         const activeAlerts = await PriceAlert.find({ isActive: true }); // Fetch all active alerts from DB
//         const userAlertsMap = {}; // Group alerts by user

//         activeAlerts.forEach(alert => {
//             if (!userAlertsMap[alert.userId]) {
//                 userAlertsMap[alert.userId] = [];
//             }
//             userAlertsMap[alert.userId].push(alert);
//         });

//         Object.keys(userAlertsMap).forEach(userId => {
//             subscribeToStockPrice(userAlertsMap[userId], (trade) => {
//                 console.log(`Trade alert for user ${userId}:`, trade);
//             });
//         });
//     } catch (error) {
//         console.error('Error restoring active alerts:', error);
//     }
// };

// module.exports = {
//     subscribeToStockPrice,   
//     unsubscribeStockPrice,    
//     stopWs,     
//     restoreActiveAlerts,
// };














// handle wll the update

// const { alpaca } = require('../API/alpaca'); // Importing Alpaca connection
// const PriceAlert = require('../models/PriceAlert');

// let ws; // WebSocket instance
// let isConnected = false; // Connection state
// let subscribedSymbols = new Set(); // Track subscribed symbols

// // Initialize WebSocket session
// const initializeSession = () => {
//     if (!ws.session.subscriptions) {
//         ws.session.subscriptions = { trades: [] };
//     }
// };

// // Subscribe to stock price
// const subscribeToStockPrice = (userAlerts, priceCallback) => {
//     if (!ws) {
//         ws = alpaca.data_stream_v2; // Initialize WebSocket if not already done
//     }

//     // Initialize the WebSocket session if necessary
//     initializeSession();

//     const symbols = userAlerts.map(alert => alert.symbol); // Get unique symbols from userAlerts

//     if (symbols.length === 0) {
//         console.log('No active price alerts for this user. Not subscribing to anything.');
//         return;
//     }

//     const symbolsToSubscribe = symbols.filter(symbol => !subscribedSymbols.has(symbol));

//     if (symbolsToSubscribe.length > 0) {
//         // If the WebSocket is not connected, reconnect before subscribing
//         if (!isConnected) {
//             console.log('WebSocket is not connected. Reconnecting...');
//             ws.onConnect(() => {
//                 console.log('Reconnected to Alpaca WebSocket');
//                 isConnected = true;

//                 // Ensure session subscriptions are initialized properly
//                 initializeSession();

//                 ws.subscribeForTrades(symbolsToSubscribe); // Subscribe to trade updates for symbols
//                 symbolsToSubscribe.forEach(symbol => subscribedSymbols.add(symbol));
//                 console.log(`Subscribed to trades for: ${symbolsToSubscribe.join(', ')}`);
//             });

//             ws.onError((err) => {
//                 console.error('WebSocket error: ', err);
//             });

//             ws.onDisconnect(() => {
//                 console.log('Disconnected from Alpaca WebSocket');
//                 isConnected = false; // Set connected state to false
//             });

//             ws.onStockTrade((trade) => {
//                 if (subscribedSymbols.has(trade.S)) {
//                     priceCallback(trade); // Callback with trade data
//                 }
//             });

//             ws.connect(); // Reconnect the WebSocket
//         } else {
//             // WebSocket is already connected, subscribe directly
//             console.log(`Attempting to subscribe to symbols (existing connection): ${symbolsToSubscribe}`);
//             ws.subscribeForTrades(symbolsToSubscribe); // Subscribe to trade updates for new symbols
//             symbolsToSubscribe.forEach(symbol => subscribedSymbols.add(symbol));
//             console.log(`Subscribed to trades for: ${symbolsToSubscribe.join(', ')}`);
//         }
//     } else {
//         console.log('No new symbols to subscribe.');
//     }
// };

// // Unsubscribe from stock price
// const unsubscribeStockPrice = (symbols) => {
//     if (!ws) {
//         console.error('WebSocket is not initialized.');
//         return;
//     }

//     const symbolsToUnsubscribe = symbols.filter(symbol => subscribedSymbols.has(symbol));

//     if (symbolsToUnsubscribe.length > 0) {
//         ws.unsubscribeFromTrades(symbolsToUnsubscribe); 
//         symbolsToUnsubscribe.forEach(symbol => subscribedSymbols.delete(symbol));
//         console.log(`Unsubscribed from trades for: ${symbolsToUnsubscribe.join(', ')}`);

//         // If no more symbols are subscribed, consider stopping the WebSocket connection
//         if (subscribedSymbols.size === 0) {
//             console.log('No more symbols subscribed. Disconnecting WebSocket.');
//             stopWs(); // Stop the WebSocket connection if no symbols are left
//         }
//     } else {
//         console.log('No symbols to unsubscribe.');
//     }
// };

// // Stop WebSocket connection
// const stopWs = () => {
//     if (ws) {
//         ws.disconnect(); // Disconnect the WebSocket
//         console.log('WebSocket disconnected');
//         ws = null; // Reset ws
//         isConnected = false; // Reset state
//         subscribedSymbols.clear(); // Clear all subscriptions
//     }
// };

// // Restore alerts from DB on server restart
// const restoreActiveAlerts = async () => {
//     try {
//         const activeAlerts = await PriceAlert.find({ isActive: true }); // Fetch all active alerts from DB
//         const userAlertsMap = {}; // Group alerts by user

//         activeAlerts.forEach(alert => {
//             if (!userAlertsMap[alert.userId]) {
//                 userAlertsMap[alert.userId] = [];
//             }
//             userAlertsMap[alert.userId].push(alert);
//         });

//         Object.keys(userAlertsMap).forEach(userId => {
//             subscribeToStockPrice(userAlertsMap[userId], (trade) => {
//                 console.log(`Trade alert for user ${userId}:`, trade);
//             });
//         });
//     } catch (error) {
//         console.error('Error restoring active alerts:', error);
//     }
// };

// module.exports = {
//     subscribeToStockPrice,   
//     unsubscribeStockPrice,    
//     stopWs,     
//     restoreActiveAlerts,
// };






// receive well the date


// const { alpaca } = require('../API/alpaca'); // Importing Alpaca connection
// const PriceAlert = require('../models/PriceAlert');

// let ws; // WebSocket instance
// let isConnected = false; // Connection state
// let subscribedSymbols = new Set(); // Track subscribed symbols

// // Subscribe to stock price
// const subscribeToStockPrice = (userAlerts, priceCallback) => {
//     if (!ws) {
//         ws = alpaca.data_stream_v2; // Initialize WebSocket if not already done
//     }

//     const symbols = userAlerts.map(alert => alert.symbol); // Get unique symbols from userAlerts

//     if (symbols.length === 0) {
//         console.log('No active price alerts for this user.');
//         return;
//     }

//     // If not connected, set up WebSocket events
//     if (!isConnected) {
//         ws.onConnect(() => {
//             console.log('Connected to Alpaca WebSocket');
//             isConnected = true;

//             const symbolsToSubscribe = symbols.filter(symbol => !subscribedSymbols.has(symbol));

//             if (symbolsToSubscribe.length > 0) {
//                 ws.subscribeForTrades(symbolsToSubscribe); // Subscribe to trade updates for symbols
//                 symbolsToSubscribe.forEach(symbol => subscribedSymbols.add(symbol));
//                 console.log(`Subscribed to trades for: ${symbolsToSubscribe.join(', ')}`);
//             } else {
//                 console.log('No new symbols to subscribe.');
//             }
//         });

//         ws.onError((err) => {
//             console.error('WebSocket error: ', err);
//         });

//         ws.onDisconnect(() => {
//             console.log('Disconnected from Alpaca WebSocket');
//             isConnected = false; // Set connected state to false
//         });

//         // Receiving trade data
//         ws.onStockTrade((trade) => {
//             console.log('Trade received:', trade);
//             if (subscribedSymbols.has(trade.S)) {
//                 priceCallback(trade); // Callback with trade data
//             }
//         });

//         // Connect to WebSocket
//         ws.connect();
//     } else {
//         // If already connected, subscribe to new symbols directly
//         const symbolsToSubscribe = symbols.filter(symbol => !subscribedSymbols.has(symbol));

//         if (symbolsToSubscribe.length > 0) {
//             ws.subscribeForTrades(symbolsToSubscribe); // Subscribe to trade updates for new symbols
//             symbolsToSubscribe.forEach(symbol => subscribedSymbols.add(symbol));
//             console.log(`Subscribed to trades for: ${symbolsToSubscribe.join(', ')}`);
//         } else {
//             console.log('No new symbols to subscribe.');
//         }
//     }
// };

// // Unsubscribe from stock price
// const unsubscribeStockPrice = (symbols) => {
//     if (!ws) {
//         console.error('WebSocket is not initialized.');
//         return;
//     }

//     const symbolsToUnsubscribe = symbols.filter(symbol => subscribedSymbols.has(symbol));

//     if (symbolsToUnsubscribe.length > 0) {
//         ws.unsubscribeFromTrades(symbolsToUnsubscribe); 
//         symbolsToUnsubscribe.forEach(symbol => subscribedSymbols.delete(symbol));
//         console.log(`Unsubscribed from trades for: ${symbolsToUnsubscribe.join(', ')}`);
//     } else {
//         console.log('No symbols to unsubscribe.');
//     }
// };

// // Stop WebSocket connection
// const stopWs = () => {
//     if (ws) {
//         ws.disconnect(); // Disconnect the WebSocket
//         console.log('WebSocket disconnected');
//         ws = null; // Reset ws
//         isConnected = false; // Reset state
//         subscribedSymbols.clear(); // Clear all subscriptions
//     }
// };



// // Restore alerts from DB on server restart
// const restoreActiveAlerts = async () => {
//     try {
//         const activeAlerts = await PriceAlert.find(); // Fetch all alerts from DB
//         const userAlertsMap = {}; // Group alerts by user

//         activeAlerts.forEach(alert => {
//             if (!userAlertsMap[alert.userId]) {
//                 userAlertsMap[alert.userId] = [];
//             }
//             userAlertsMap[alert.userId].push(alert);
//         });

//         Object.keys(userAlertsMap).forEach(userId => {
//             subscribeToStockPrice(userAlertsMap[userId], (trade) => {
//                 console.log(`Trade alert for user ${userId}:`, trade);
//             });
//         });
//     } catch (error) {
//         console.error('Error restoring active alerts:', error);
//     }
// };


// module.exports = {
//     subscribeToStockPrice,   
//     unsubscribeStockPrice,    
//     stopWs,     
//     restoreActiveAlerts,
       
// };
