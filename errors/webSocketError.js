class WebSocketError extends Error {
    constructor(message, originalError = null) {
        super(message);
        this.name = 'WebSocketError';
        if (originalError) {
            this.stack = originalError.stack;
            this.originalError = originalError;
        }
    }
}

module.exports = WebSocketError;
