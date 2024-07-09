const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const marketNewsSchema = new Schema({
  title: { 
    type: String, 
    required: [true, 'Please provide titke!'],
    minlength: 1,
    maxlength: [30, 'Max lenght 50 characteres'],
},
  content: { 
    type: String, 
    maxlength : [1000, 'Max lenght 1000 characteres'],
    require: [true, 'Please provide content for this new!'] 
},
  url: { 
    type: String, 
    require: [true, 'Please provide URL for this new!'] 
},
  publishedDate: { 
    type: Date, 
    require: [true, 'Please provide date!']
},
}, { timestamps: true });

const MarketNews = mongoose.model('MarketNews', marketNewsSchema);
module.exports = MarketNews;