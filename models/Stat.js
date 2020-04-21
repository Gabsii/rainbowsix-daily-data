const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatSchema = mongoose.Schema({
  generalStats: [{
    mmr: {
      type: Number,
    },
    totalGameTimeMultiplayer: {
      type: String
    },
    totalGamesPlayedMultiplayer: { 
      type: Number
    },
    wlRatioMultiplayer: { 
      type: Number
    },
    kdRatioMultiplayer: { 
      type: Number
    },
    assists: { 
      type: Number
    },
    revives: { 
      type: Number
    },
    headshots: { 
      type: Number
    },
    penetrationKills: { 
      type: Number
    },
    meeleeKills: { 
      type: Number
    },
    matchesWon: { 
      type: Number
    },
    matchesLost: { 
      type: Number
    },
    kills: { 
      type: Number
    },
    deaths: { 
      type: Number
    },
  }],
  attackers: {
    type: [{
      type: Schema.Types.ObjectId, 
      ref: 'Operator'
    }],
    required: true,
  },
  defenders: {
    type: [{
      type: Schema.Types.ObjectId, 
      ref: 'Operator'
    }],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
})

module.exports = mongoose.model('Stat', StatSchema);