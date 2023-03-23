const mongoose = require('mongoose');
const {Schema} = mongoose;

const fileSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  uuid: {
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
  currentPath: {
    type: String,
    required: true
  }
}, {timestamps: true});

module.exports = mongoose.model('File', fileSchema);