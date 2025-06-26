const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true
  },
  clickedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String
  },
  location: {
    city: String,
    country: String
  },
  deviceType: {
    type: String
  },
  browser: {
    type: String
  },
  referrer: {
    type: String
  }
});


const analyticsModel = mongoose.model('Analytics', analyticsSchema);

module.exports = analyticsModel;