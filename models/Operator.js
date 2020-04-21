const mongoose = require('mongoose');

const OperatorSchema = mongoose.Schema({
  name: {
    type: String, 
    required: true,
  },
  type: {
    type: String,
    enum: ['attacker', 'defender'],
    required: true,
  },
  time: {
    type: String,
  },
  winRate: {
    type: Number, 
  },
  kd: {
    type: Number, 
  },
  images: [{
    badge: {
      type: String,
    },
    portrait: {
      type: String,
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
})

module.exports = mongoose.model('Operator', OperatorSchema);