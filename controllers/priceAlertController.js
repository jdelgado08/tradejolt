const { 
    subscribeToStockPrice, 
    unsubscribeStockPrice, 
    stopWs 
} = require('../utils/apcaWsClient');

//subscribe to  trades
const subscribeTrades = (req, res) => {
    const { symbols } = req.body;

    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
        return res.status(400).json({ msg: "Please provide an array of symbols to subscribe" });
    }

    subscribeToStockPrice(symbols, (trade) => {
        console.log('Trade callback:', trade);
    });

    res.status(200).json({ msg: `Subscribed to trades for: ${symbols.join(', ')}` });
};

//Unsubscribe from trades
const unsubscribeTrades = (req, res) => {
    const { symbols } = req.body;

    if (!symbols || !Array.isArray(symbols) || symbols.length === 0) {
        return res.status(400).json({ msg: "Please provide an array of symbols to unsubscribe" });
    }

    unsubscribeStockPrice(symbols);
    res.status(200).json({ msg: `Unsubscribed from trades for: ${symbols.join(', ')}` });
};

//Stop WebSocket
const stopWebSocket = (req, res) => {
    stopWs();
    res.status(200).json({ msg: "WebSocket connection stopped" });
};

module.exports = {
    subscribeTrades,
    unsubscribeTrades,
    stopWebSocket
};
