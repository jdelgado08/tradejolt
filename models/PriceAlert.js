const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const priceAlertSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},
  symbol: { 
    type: String, 
    require: [true, 'Please provide symbol to Alert']
},
  priceLevel: { 
    type: Number, 
    require: [true, 'Please provide price Level'] 
},
  condition: { 
    type: String, 
    //adjust this field when controllers done!!
    enum: ['above', 'below'], 
    required: true 
},  
}, { timestamps: true });

const PriceAlert = mongoose.model('PriceAlert', priceAlertSchema);
module.exports = PriceAlert;