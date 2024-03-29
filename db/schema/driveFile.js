const mongoose = require('mongoose');
const permissionWithSchema = require('./permissionWith');
const { Schema } = mongoose;

const driveFileSchema = new Schema(
  {
    parentFolderId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    extention: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    savedFileId: {
      type: Schema.Types.ObjectId,
      ref: 'File',
    },
    permissionWith: [permissionWithSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DriveFile', driveFileSchema);
