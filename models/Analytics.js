const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    unique: true,
    required: true
  },
  totalClicks: { type: Number, default: 0 },
  uniqueVisitors: { type: Number, default: 0 },
  ipSet: { type: [String], default: [] },

  dailyClicks: { type: Map, of: Number, default: {} },
  hourlyActivity: { type: Map, of: Number, default: {} },
  deviceDistribution: { type: Map, of: Number, default: {} },
  topLocations: { type: Map, of: Number, default: {} },

  // 👇 Store previous week's snapshot
  weeklySnapshots: [{
    weekStart: Date, // e.g., last Monday
    totalClicks: Number,
    uniqueVisitors: Number
  }],

  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const analyticsModel = mongoose.model('Analytics', analyticsSchema);

module.exports = analyticsModel;