const mongoose = require('mongoose')
const { Schema } = mongoose

const DishesSchema = Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  category: {
    type: String,
    enum: ['starter', 'dishes', 'dessert', 'drink'],
    default: 'starter',
    required: true
  },
  restaurant: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Dishes', DishesSchema)
