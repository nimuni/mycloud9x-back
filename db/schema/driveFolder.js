const mongoose = require('mongoose');
const permissionWithSchema = require('./permissionWith')
const { Schema } = mongoose;

const driveFolderSchema = new Schema({
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
  permissionWith: [permissionWithSchema]
},
{
  timestamps: true,
});

module.exports = mongoose.model('DriveFolder', driveFolderSchema);