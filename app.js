require('dotenv').config();
require('express-async-errors')//aplys the try & catch to all our controllers automatically
//express
const express = require('express');
const app = express();
require('./utils/schedulerReports');

//packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

//routers
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const accountRouter = require('./routes/accountRoutes');
const tradeRouter = require('./routes/tradeRoutes');
const commentRouter = require('./routes/commentRoutes');

//DB
const mongoDB = require('./db/connect');


//middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(morgan('tiny'))//logger, dbg
app.use(express.json())//acess json to our req.body
app.use(cookieParser(process.env.JWT_STRING))//acess the cookie


app.get('/', (req, res) => {
    res.send('TradeJolt API');
});
app.get('/api', (req, res) => {
    // console.log(req.cookies)
    console.log(req.signedCookies);
    res.send('TradeJolt API');
});

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/accounts', accountRouter);
app.use('/api/trades', tradeRouter);
app.use('/api/comments', commentRouter);


app.use(notFoundMiddleware)//once we "hit" here, we done, no next in this Middleware.
app.use(errorHandlerMiddleware) //only hit from a "sucessfull" route.


const port = process.env.PORT || 3000
//db connection
const start = async () => {
    try {
        await mongoDB()//return promise
        app.listen(port, console.log(`Server is listening at port ${port}!!!`))
    } catch (error) {
        console.log(error);
    }
}

start();
