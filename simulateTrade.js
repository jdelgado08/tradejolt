const { PriceAlert } = require('./models/PriceAlert');
const { sendEmail } = require('./utils/sendEmail');
const { handleTrade } = require('./utils/apcaWsClient'); // Adjust this path based on where the function is located

const simulateTrade = async () => {
    // Define a simulated trade
    const simulatedTrade = {
        S: 'AAPL',  // Symbol
        p: 230.5,   // Price (this should trigger the alert)
        Timestamp: new Date().toISOString(), // Simulated timestamp
    };

    console.log('Simulating trade:', simulatedTrade);

    // Call the function that handles trades
    await handleTrade(simulatedTrade);
};

simulateTrade().then(() => {
    console.log('Simulation complete.');
    process.exit();
}).catch(error => {
    console.error('Error during simulation:', error);
    process.exit(1);
});
