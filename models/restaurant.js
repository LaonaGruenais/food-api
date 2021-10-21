const mongoose = require('mongoose')
const { Schema } = mongoose
// = const Schema = mongoose.Schema

// Déclaration du Schema
const RestaurantSchema = Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  dishes: [{
    type: Schema.Types.ObjectId,
    ref: 'dishes'
  }]
}, { timestamps: true })

module.exports = mongoose.model('Restaurant', RestaurantSchema)
