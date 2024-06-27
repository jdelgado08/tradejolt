require('dotenv').config();
require('express-async-errors')//aplys the try & catch to all our controllers automatically
//express
const express = require('express')
const app = express()

//packages
const morgan = require('morgan')

//routers
const authRouter = require('./routes/authRoutes')

//DB
const mongoDB = require('./db/connect')


//middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.use(morgan('tiny'))//logger, dbg
app.use(express.json())//acess json to our req.body


app.get('/', (req, res) => {
    res.send('TradeJolt API')
})

app.use('/api/auth',authRouter) 

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

start()
