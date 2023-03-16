const mongoose = require('mongoose');
const crypto = require("../../js/crypto")
const { Schema } = mongoose;

const folderSchema = new Schema({
  parentFolderId: {
    type: String,
    required: true
  },
  name: {
    type: String,
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

module.exports = mongoose.model('Folder', folderSchema);