# TradeJolt

TradeJolt is a comprehensive real-time price alert and trading management system designed to empower users in the financial markets. It combines real-time price alerts, automated and manual trading strategies, and a robust user management system. Users can create and manage multiple trading accounts, generate detailed reports, and receive real-time notifications on stock and cryptocurrency price movements.

The system is built using modern web technologies, ensuring seamless real-time data processing, efficient management of user data, and integration with financial APIs for accurate and timely trading information.

## Features

### User Management & Authentication
- **User Registration & Validation**: Secure user registration with email validation and JWT-based authentication for protected routes.
- **Multiple Trading Accounts**: Users can create and manage multiple trading accounts, each with its own set of price alerts and trading strategies.
- **Account Management**: Full CRUD operations for creating, updating, and managing trading accounts, including the ability to allocate funds and track account performance.

### Real-Time Price Alerts
- **Customizable Alerts**: Users can set specific price levels for various assets (stocks and cryptocurrencies) with conditions such as "above" or "below."
- **Automated Alerts**: The system automatically triggers alerts based on real-time price data from the Alpaca API, ensuring users are notified as soon as conditions are met.
- **WebSocket Management**: Efficient WebSocket handling to ensure real-time data streaming without unnecessary resource consumption.

### Automated & Manual Trading
- **Manual Trading**: Users can execute trades manually within the platform, allowing them to make real-time decisions based on current market data.
- **Automated Trading**: Integration with trading algorithms that execute trades automatically based on predefined strategies, making it easier for users to implement systematic trading approaches.

### Reporting & Analytics
- **Report Generation**: Users can generate detailed reports on their trading performance, account activity, and alert history. Reports can be customized and exported in various formats (PDF, CSV).
- **Trade Tracking**: Every trade executed manually or automatically is logged and tracked, allowing users to analyze their trading history and performance.
- **Portfolio Analysis**: Users receive insights into their portfolios, helping them make informed decisions on rebalancing, risk management, and strategy adjustments.

### Notifications & Alerts
- **Email Notifications**: Users receive email notifications for important events such as price alerts being triggered, account balance updates, and report availability.
- **Real-Time Updates**: Alerts are delivered in real-time via WebSockets, ensuring users are notified immediately of significant market movements.

### CRUD Operations
- **Comprehensive CRUD Functionality**: Full CRUD operations are available across all major features of the platform, including user accounts, trading accounts, price alerts, and reports.

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ORM
- **Real-Time Data**: Alpaca API for real-time stock and cryptocurrency price data
- **WebSockets**: Used for real-time updates and managing live trading data
- **Authentication**: JWT-based authentication and email verification
- **Email Integration**: Nodemailer for sending email notifications and alerts
- **Reports**: PDF and CSV generation for reporting on trading activity and portfolio performance

## Setup and Installation

To get started with the project, clone this repository and run the following commands:

npm install
npm run dev

Make sure to configure your environment variables with your Alpaca API credentials, email SMTP settings, and other necessary configurations.

### Environment Variables

*   `ALPACA_API_KEY`: Your Alpaca API Key
*   `ALPACA_API_SECRET`: Your Alpaca API Secret
*   `MONGODB_URI`: MongoDB connection string
*   `JWT_SECRET`: Secret key for JWT authentication
*   `EMAIL_USER`: Email address for sending notifications (e.g., Gmail SMTP)
*   `EMAIL_PASS`: Password or App-Specific Password for the email service
*   `SMTP_HOST`: SMTP host for the email service (e.g., smtp.gmail.com)
*   `SMTP_PORT`: SMTP port number (e.g., 587 for Gmail)

## Roadmap

### Future Features

*   **Frontend Interface**: A comprehensive frontend will be developed using React.js to provide a user-friendly dashboard for managing alerts, trades, and reports.
*   **AI-Powered Trading Suggestions**: Integration with AI models to analyze user trading patterns and market data, providing intelligent trade recommendations and strategy optimizations.
*   **Improved Code Efficiency**: Refactoring and optimization of the codebase to improve performance and scalability.
*   **Expanded Notification Options**: Adding support for SMS and push notifications to alert users across different devices.

### Documentation & Live Demo

*   [Documentation (Coming Soon)](#)
*   [Live Project (Coming Soon)](#)
