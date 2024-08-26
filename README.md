# TradeJolt

TradeJolt is a comprehensive trading management system designed to help users efficiently track and manage their trades across multiple accounts. This system provides users with real-time price alerts for stocks, enabling them to stay informed about market movements. While not a direct trading platform, TradeJolt serves as a powerful tool for registering trades made on external platforms, allowing users to keep detailed records of their trading activity.

Users can choose between manual and automated methods to log their trades, making TradeJolt adaptable to different trading styles. The platform also supports the creation and management of multiple trading accounts, detailed report generation, and email notifications, helping traders stay organized and informed.

TradeJolt is built using modern web technologies, ensuring seamless real-time data processing, efficient user data management, and integration with financial APIs for accurate and timely price information. In addition to these features, TradeJolt incorporates elements of a trading journal, allowing users to document their trade history and gain insights through the system's reporting tools.

This project was developed as part of my final year as a software engineering student, with a focus on building a versatile tool that enhances the way traders interact with the markets.

## Features

### User Management & Authentication
- **User Registration & Validation**: Secure user registration with email validation and JWT-based authentication for protected routes.
- **Multiple Trading Accounts**: Users can create and manage multiple trading accounts, each with its own set of price alerts and trading strategies.
- **Account Management**: Full CRUD operations for creating, updating, and managing trading accounts, including the ability to allocate funds and track account performance.

### Real-Time Price Alerts
- **Customizable Alerts**: Users can set specific price levels for various assets (stocks and cryptocurrencies) with conditions such as "above" or "below."
- **Automated Alerts**: The system automatically triggers alerts based on real-time price data from the Alpaca API, ensuring users are notified as soon as conditions are met.
- **WebSocket Management**: Efficient WebSocket handling to ensure real-time data streaming without unnecessary resource consumption.

### Automated & Manual Trade Logging
- **Manual Trade Logging**: Users can manually log their trades within the platform. This feature allows traders to document trades executed on external trading platforms, ensuring they can track and review their actions based on 
- **Automated Trade Logging**: Users can automate the logging of trades by integrating predefined criteria within the system. This automated process records trades executed on external platforms based on the user's predefined strategies, helping to streamline the record-keeping process without requiring manual input for every trade.

### Reporting & Analytics
- **Report Generation**: Users can generate detailed reports on their trading performance, account activity, and alert history. 
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
