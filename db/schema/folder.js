const mongoose = require('mongoose');
const sharedWithSchema = require('./sharedWith')
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
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sharedWith: [sharedWithSchema]
},
{
  timestamps: true,
});

module.exports = mongoose.model('Folder', folderSchema);