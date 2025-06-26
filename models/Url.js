const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
 originalUrl: {
   type: String,
   required: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  shortUrl:{
    type: String
  },
  clickCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

// Optional: explicitly define index (even if already set in field)
// urlSchema.index({ shortCode: 1 }, { unique: true });

const urlModel = mongoose.model('Url', urlSchema);

module.exports = urlModel;