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

        const userAlerts = await PriceAlert.find({ userId, isActive: true });

        console.log('Subscribing to stock price alerts after alert creation.');
        subscribeToStockPrice(userAlerts, (trade) => {
            console.log('Price alert triggered:', trade);

            if (trade.p >= priceLevel && condition === 'above') {
                console.log(`Alert! ${symbol} is now above ${priceLevel}.`);
            }

            if (trade.p <= priceLevel && condition === 'below') {
                console.log(`Alert! ${symbol} is now below ${priceLevel}.`);
            }
        });

        res.status(201).json(newAlert);
    } catch (error) {
        console.error('Error creating price alert:', error);
        res.status(500).json({ msg: 'Failed to create price alert' });
    }
};

// Get all price alerts for the user
const getPriceAlerts = async (req, res) => {
    const userId = req.user.userId;
    const alerts = await PriceAlert.find({ userId });
    res.status(200).json(alerts);
};

// Delete price alert
const deletePriceAlert = async (req, res) => {
    const { id: alertId } = req.params;
    const userId = req.user.userId;

    try {
        const alert = await PriceAlert.findOne({ _id: alertId, userId });

        if (!alert) {
            return res.status(404).json({ msg: 'Alert not found or unauthorized' });
        }

        await PriceAlert.deleteOne({ _id: alertId, userId });

        console.log(`Unsubscribing from symbol ${alert.symbol} after deletion.`);
        unsubscribeStockPrice([alert.symbol]);

        res.status(200).json({ msg: 'Price alert deleted successfully' });
    } catch (error) {
        console.error('Error deleting alert:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Update price alert
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

    console.log(`Alert ${alert.symbol} updated: Was Active: ${wasActive}, Is Active: ${alert.isActive}`);

    if (wasActive && !alert.isActive) {
        unsubscribeStockPrice([alert.symbol]);
    } else if (!wasActive && alert.isActive) {
        const updatedAlert = await PriceAlert.findById(id);
        subscribeToStockPrice([updatedAlert], (trade) => {
            console.log('Received trade:', trade);
        });
    }

    res.status(200).json(alert);
};

module.exports = {
    createPriceAlert,
    getPriceAlerts,
    deletePriceAlert,
    updatePriceAlert,
};




// const PriceAlert = require('../models/PriceAlert');
// const { subscribeToStockPrice, unsubscribeStockPrice } = require('../utils/apcaWsClient');

// const mongoose = require('mongoose');

// // Create a new price alert
// const createPriceAlert = async (req, res) => {
//     const { symbol, priceLevel, condition } = req.body;

//     // Validate inputs
//     if (!symbol || !priceLevel || !condition) {
//         return res.status(400).json({ msg: 'All fields are required' });
//     }

//     // Fetch user ID from req.user (assuming the authentication middleware sets it)
//     const userId = req.user.userId; // Or req.user._id if that's how it's being set

//     try {
//         // Save the alert in the database
//         const newAlert = await PriceAlert.create({
//             userId,
//             symbol,
//             priceLevel,
//             condition
//         });

//         // Fetch user's active alerts
//         const userAlerts = await PriceAlert.find({ userId });

//         // Subscribe to stock price alerts for user's active alerts
//         subscribeToStockPrice(userAlerts, (trade) => {
//             console.log('Price alert triggered:', trade);

//             // Logic to handle the price alert (e.g., send notifications)
//             if (trade.p >= priceLevel && condition === 'above') {
//                 console.log(`Alert! ${symbol} is now above ${priceLevel}.`);
//                 // Add notification logic here (e.g., email, SMS, push notification)
//             }

//             if (trade.p <= priceLevel && condition === 'below') {
//                 console.log(`Alert! ${symbol} is now below ${priceLevel}.`);
//                 // Add notification logic here
//             }
//         });

//         res.status(201).json(newAlert);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ msg: 'Failed to create price alert' });
//     }
// };

// // Get all price alerts for the user
// const getPriceAlerts = async (req, res) => {
//     const userId = req.user.userId;
//     const alerts = await PriceAlert.find({ userId });
//     res.status(200).json(alerts);
// };
// const deletePriceAlert = async (req, res) => {
//     const { id: alertId } = req.params;  // Extract alert ID from the URL params
//     const userId = req.user.userId;  // Extract the user ID from the request

//     console.log('Alert ID:', alertId);
//     console.log('User ID:', userId);

//     try {
//         // Find the alert by ID and check that it belongs to the current user
//         const alert = await PriceAlert.findOne({
//             _id: alertId,
//             userId: userId
//         });

//         // Log the found alert for debugging
//         console.log('Found Alert:', alert);

//         // If no alert is found, return an error
//         if (!alert) {
//             return res.status(404).json({ msg: 'Alert not found or unauthorized' });
//         }

//         // Proceed to delete the alert
//         await PriceAlert.deleteOne({ _id: alertId, userId: userId });

//         // Disconnect the WebSocket for this symbol if no more alerts are set for it
//         unsubscribeStockPrice([alert.symbol]);

//         res.status(200).json({ msg: 'Price alert deleted successfully' });
//     } catch (error) {
//         console.error('Error while deleting alert:', error);
//         res.status(500).json({ msg: 'Server error' });
//     }
// };
// const updatePriceAlert = async (req, res) => {
//     const { id } = req.params;
//     const { priceLevel, condition, isActive } = req.body;

//     const alert = await PriceAlert.findById(id);

//     if (!alert) {
//         return res.status(404).json({ msg: 'Price alert not found' });
//     }

//     const wasActive = alert.isActive;
//     alert.priceLevel = priceLevel !== undefined ? priceLevel : alert.priceLevel;
//     alert.condition = condition !== undefined ? condition : alert.condition;
//     alert.isActive = isActive !== undefined ? isActive : alert.isActive;
//     await alert.save();

//     console.log(`Updated Alert: ${JSON.stringify(alert)}`);

//     if (wasActive && !alert.isActive) {
//         console.log(`Unsubscribing from symbol: ${alert.symbol}`);
//         unsubscribeStockPrice([alert.symbol]);
//     } else if (!wasActive && alert.isActive) {
//         console.log(`Re-subscribing to symbol: ${alert.symbol}`);

//         const activeAlerts = await PriceAlert.find({ userId: req.user.userId, isActive: true });
//         subscribeToStockPrice(activeAlerts, (trade) => {
//             console.log('Received trade:', trade);
//         });
//     } else {
//         console.log('No state change detected.');
//     }

//     res.status(200).json(alert);
// };





// module.exports = {
//     createPriceAlert,
//     getPriceAlerts,
//     deletePriceAlert,
//     updatePriceAlert
// };
