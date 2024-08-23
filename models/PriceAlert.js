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
    required: [true, 'Please provide a symbol for the alert'] 
  },
  priceLevel: { 
    type: Number, 
    required: [true, 'Please provide a price level'] 
  },
  condition: { 
    type: String, 
    enum: ['above', 'below'], 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  hasTriggered: { 
    type: Boolean, 
    default: false 
  },
}, { timestamps: true });

const PriceAlert = mongoose.model('PriceAlert', priceAlertSchema);
module.exports = PriceAlert;
