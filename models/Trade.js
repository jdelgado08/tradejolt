
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tradeSchema = Schema({

    accountId: {
        type: Schema.Types.ObjectId,
        ref : 'Account',
        required : true,
    },
    symbol : {
        type : String,
        required : [true, 'Please provide symbol of trade'],
    },
    tradeDate: {
        type : Date ,
        required : [true, 'Please provide date'],
    },
    entryTime: { 
        type: String,
        required : [true, 'Please provide entry time'],
    },
     exitTime: { 
        type: Date,
        required : [true, 'Please provide exit time'],
     
    },
    entryPrice: { 
        type: Number,
        required : [true, 'Please provide entry price'],
    },
    exitPrice: { 
        type: Number,
        required : [true, 'Please provide exit price'],
    },
    size: { 
        type: Number, 
        required : [true, 'Please provide size'],
    },
    tradeType: { 
        type: String,
        enum: ['buy', 'short'], 
        required: true 
    },
    fees: { 
        type: Number, 
        required : [true, 'Please provide value of fees'],
    },
    notes: {
        type: String,
        maxlength : [1000, 'Max lenght 1000 characteres'],
    },
    image: {
        type: String,
        default: '/uploads/default.jpeg'
    }
}, { timestamps: true });

const Trade = mongoose.model('Trade', tradeSchema);
module.exports = Trade;
