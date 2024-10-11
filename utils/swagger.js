
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger configuration
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'TRADEJOLT API Documentation',
    version: '1.0.0',
    description: 'Swagger Documentation for TradeJolt',
  },
  servers: [
    {
        url: 'https://tradejolt.onrender.com/api', 
        description: 'Production Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Account: {
        type: 'object',
        properties: {
          accountName: {
            type: 'string',
            description: "The name of the user's account.",
          },
          initialBalance: {
            type: 'number',
            description: 'The initial balance of the account.',
          },
          currentBalance: {
            type: 'number',
            description: 'The current balance of the account.',
          },
          isActive: {
            type: 'boolean',
            description: 'Indicates if the account is active.',
          },
          emailReport: {
            type: 'boolean',
            description: 'Indicates if email reports are enabled for the account.',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'The time when the account was created.',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'The last time the account was updated.',
          },
        },
      },
      Comment: {
        type: 'object',
        properties: {
          content: {
            type: 'string',
            description: "The content of the user's comment.",
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'The time when the comment was created.',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'The last time the comment was updated.',
          },
        },
      },
      PriceAlert: {
        type: 'object',
        properties: {
          symbol: {
            type: 'string',
            description: 'The stock symbol associated with the price alert.',
          },
          priceLevel: {
            type: 'number',
            description: 'The price level that triggers the alert.',
          },
          condition: {
            type: 'string',
            enum: ['above', 'below'],
            description: 'Condition to trigger the alert (price above or below the threshold).',
          },
          isActive: {
            type: 'boolean',
            description: 'Indicates if the alert is active.',
          },
          hasTriggered: {
            type: 'boolean',
            description: 'Indicates if the alert has already triggered.',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'The time when the alert was created.',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'The last time the alert was updated.',
          },
        },
      },
      Report: {
        type: 'object',
        properties: {
          period: {
            type: 'string',
            enum: ['daily', 'weekly', 'monthly', 'custom'],
            description: 'The period of the report.',
          },
          date: {
            type: 'string',
            format: 'date-time',
            description: 'The date of the report.',
          },
          data: {
            type: 'object',
            properties: {
              netPnL: {
                type: 'number',
                description: 'Net profit and loss.',
              },
              totalContracts: {
                type: 'number',
                description: 'Total number of contracts.',
              },
              totalFees: {
                type: 'number',
                description: 'Total fees.',
              },
              totalTrades: {
                type: 'number',
                description: 'Total number of trades.',
              },
              avgWinningTrade: {
                type: 'number',
                description: 'Average winning trade amount.',
              },
              avgLosingTrade: {
                type: 'number',
                description: 'Average losing trade amount.',
              },
              winningTradePercent: {
                type: 'number',
                description: 'Percentage of winning trades.',
              },
              totalAccountBalance: {
                type: 'number',
                description: 'Total account balance.',
              },
            },
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'The time when the report was created.',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'The last time the report was updated.',
          },
        },
      },
      Trade: {
        type: 'object',
        properties: {
          symbol: {
            type: 'string',
            description: 'The stock symbol involved in the trade.',
          },
          tradeDate: {
            type: 'string',
            format: 'date',
            description: 'The date when the trade occurred.',
          },
          entryTime: {
            type: 'string',
            format: 'date-time',
            description: 'The time when the trade was entered.',
          },
          exitTime: {
            type: 'string',
            format: 'date-time',
            description: 'The time when the trade was exited.',
          },
          entryPrice: {
            type: 'number',
            description: 'Price at the start of the trade.',
          },
          exitPrice: {
            type: 'number',
            description: 'Price at the end of the trade.',
          },
          size: {
            type: 'number',
            description: 'Number of contracts/shares traded.',
          },
          tradeType: {
            type: 'string',
            enum: ['Short', 'Long'],
            description: 'The type of trade (Short or Long).',
          },
          fees: {
            type: 'number',
            description: 'Fees associated with the trade.',
          },
          netProfitLoss: {
            type: 'number',
            description: 'Net profit or loss from the trade.',
          },
          platform: {
            type: 'string',
            description: 'The platform used for the trade (default: Manual Entry).',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'The time when the trade was created.',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'The last time the trade was updated.',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            description: 'The unique username of the user.',
          },
          email: {
            type: 'string',
            description: "The user's email address.",
          },
          role: {
            type: 'string',
            enum: ['admin', 'manager', 'user'],
            description: 'The role assigned to the user.',
          },
          firstName: {
            type: 'string',
            description: 'The first name of the user.',
          },
          lastName: {
            type: 'string',
            description: 'The last name of the user.',
          },
          isActive: {
            type: 'boolean',
            description: "Indicates if the user's account is active.",
          },
          isEmailConfirmed: {
            type: 'boolean',
            description: "Indicates if the user's email is confirmed.",
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'The time when the user account was created.',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'The last time the user account was updated.',
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const swaggerSpec = swaggerJsdoc({
  swaggerDefinition,
  apis: ['./routes/*.js'], 
});

const setupSwagger = (app) => {
  app.use('/tradeJolt-api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
