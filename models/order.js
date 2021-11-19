const mongoose = require('mongoose')
const { Schema } = mongoose

const OrderSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cart: [{
    type: Schema.Types.ObjectId,
    ref: 'Dishes',
    required: true
  }],
  address: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Order', OrderSchema)
