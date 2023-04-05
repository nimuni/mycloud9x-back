const mongoose = require('mongoose');
const permissionWithSchema = require('./permissionWith');
const { Schema } = mongoose;

const driveRootSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    currentSize: {
      type: Number,
      required: true,
    },
    maximumSize: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DriveRoot', driveRootSchema);
