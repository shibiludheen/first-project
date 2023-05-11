const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  expiresAt: {
    type: Date
  },
});

module.exports = mongoose.model('Banner', bannerSchema);
