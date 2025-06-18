const mongoose = require('mongoose');
const validator = require('validator');

const itemSchema = new mongoose.Schema({
  data: {
    type: Date,
    required: true,
  },
  discription: {
    type: String,
    required: true,
    maxlength: 30,
  },
  value: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    maxlength: 30,
  },
  type: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },

});

module.exports = mongoose.model('item', itemSchema);