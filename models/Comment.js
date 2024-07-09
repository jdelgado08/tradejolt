const mongoose = require('mongoose')
const Schema = mongoose.Schema

const commentSchema = new Schema({
  tradeId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Trade', 
    required: true 
},
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},
  content: { 
    type: String, 
    maxlength : [1000, 'Max lenght 1000 characteres'],
    require: [true, 'Please provide content for this comment!']
}
}, { timestamps: true })

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment