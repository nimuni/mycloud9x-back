const mongoose = require('mongoose');
const {Schema} = mongoose;

const fileSchema = new Schema({
  location: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
}, {timestamps: true});

module.exports = mongoose.model('File', fileSchema);