
const { alpaca } = require('./API/alpaca');

let ws = alpaca.data_stream_v2;

// Function to disconnect WebSocket gracefully
const killWebSocketConnection = () => {
    ws.onConnect(() => {
        console.log('Connected to Alpaca WebSocket. Now attempting to disconnect...');
        ws.disconnect();
    });

    ws.onDisconnect(() => {
        console.log('Disconnected from Alpaca WebSocket.');
        process.exit(0); // Exit the script after disconnecting
    });

    ws.onError((err) => {
        console.log('Error occurred:', err);
        process.exit(1); // Exit with an error code
    });

    ws.connect(); // Initiates the connection
};

// Run the function to kill the connection
killWebSocketConnection();