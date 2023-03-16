const mongoose = require('mongoose');
const crypto = require("../../js/crypto")
const { Schema } = mongoose;

const fileSchema = new Schema({
  parentFolderId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  extention: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  owner: {
    type: String,
    required: true
  }
},
{
  timestamps: true,
});

module.exports = mongoose.model('File', fileSchema);