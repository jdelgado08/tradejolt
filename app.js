require('dotenv').config();
require('express-async-errors')//aplys the try & catch to all our controllers automatically
//express
const express = require('express');
const app = express();
require('./utils/schedulerReports');

//packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

//security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require ('xss');
const rateLimit = require ('express-rate-limit');


//routers
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const accountRouter = require('./routes/accountRoutes');
const tradeRouter = require('./routes/tradeRoutes');
const commentRouter = require('./routes/commentRoutes');
const reportRouter = require('./routes/reportRoutes');
const priceAlertRouter = require('./routes/priceAlertRoutes');

//DB
const mongoDB = require('./db/connect');
const { restoreActiveAlerts } = require('./utils/apcaWsClient');

//ALPACA API
const { connectAlpaca } = require('./API/alpaca');

// Swagger setup
const setupSwagger = require('./utils/swagger');

//middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// Set up Swagger
setupSwagger(app);

app.use(morgan('tiny'))//logger, dbg
app.use(express.json())//acess json to our req.body
app.use(cookieParser(process.env.JWT_STRING))//acess the cookie

//comment for dev prop
// app.use(rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
// 	limit: 100,// Limit each IP to 100 requests per `window` (here, per 15 minutes)

//     })
// );
app.use(helmet());
app.use(cors());
// app.use(xss()); need to do middleware to it...
// Routes
app.get('/', (req, res) => {
    res.send('TradeJolt API');
});
// app.get('/api', (req, res) => {
//     // console.log(req.cookies)
//     console.log(req.signedCookies);
//     res.send('TradeJolt API');
// });
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/trades', tradeRouter);
app.use('/api/comments', commentRouter);
// console.log('Report router loaded');
app.use('/api/reports', reportRouter);
app.use('/api/priceAlert', priceAlertRouter);


app.use(notFoundMiddleware)//once we "hit" here, we done, no next in this Middleware.
app.use(errorHandlerMiddleware) //only hit from a "sucessfull" route.


const port = process.env.PORT || 3000
//db connection
const start = async () => {
    try {
        await mongoDB();
        await restoreActiveAlerts(); //restore alarms

        app.listen(port, console.log(`Server is listening at port ${port}!!!`));
    } catch (error) {
        console.log(error);
    }
};

start();
