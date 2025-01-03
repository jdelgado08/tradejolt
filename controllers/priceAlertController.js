const PriceAlert = require('../models/PriceAlert');
const { syncWebSocketSubscriptions } = require('../utils/apcaWsClient');

// Create a new price alert
const createPriceAlert = async (req, res) => {
    const { symbol, priceLevel, condition, userEmail } = req.body;
    

    console.log(userEmail);
    
    // Validate inputs
    if (!symbol || !priceLevel || !condition) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    if (!req.user) {
        return res.status(403).json({ msg: 'Not authorized to create this alert' });
    }

    const userId = req.user.userId;

    // Add validation before trying to create the alert
    if (isNaN(priceLevel) || !['above', 'below'].includes(condition)) {
        return res.status(400).json({ msg: 'Invalid priceLevel or condition' });
    }

    try {
        const newAlert = await PriceAlert.create({
            userId,
            symbol,
            priceLevel,
            condition,
            isActive: true, // Default to active on creation
            userEmail,
        });

        console.log('Subscribing to stock price alerts after alert creation.');

        //sync WebSocket subscriptions after creating the alert
        await syncWebSocketSubscriptions();

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

        // Sync WebSocket subscriptions after deleting the alert
        await syncWebSocketSubscriptions();

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

    try {
        const alert = await PriceAlert.findById(id);
        if (!alert) {
            return res.status(404).json({ msg: 'Price alert not found' });
        }

        alert.priceLevel = priceLevel !== undefined ? priceLevel : alert.priceLevel;
        alert.condition = condition !== undefined ? condition : alert.condition;
        alert.isActive = isActive !== undefined ? isActive : alert.isActive;
        await alert.save();

        console.log(`Alert ${alert.symbol} updated: Was Active: ${alert.isActive}`);

        //Sync WebSocket subscriptions after updating the alert
        await syncWebSocketSubscriptions();

        res.status(200).json(alert);
    } catch (error) {
        console.error('Error updating price alert:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

//restore all active price alerts from DB
const restorePriceAlerts = async (req, res) => {
    try {
        //restore all active price alerts when the server restarts
        await syncWebSocketSubscriptions();
        res.status(200).json({ msg: 'Alerts restored successfully.' });
    } catch (error) {
        console.error('Error restoring alerts:', error);
        res.status(500).json({ msg: 'Failed to restore alerts' });
    }
};

module.exports = {
    createPriceAlert,
    getPriceAlerts,
    deletePriceAlert,
    updatePriceAlert,
    restorePriceAlerts,
};

