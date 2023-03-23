const mongoose = require('mongoose');
const { Schema } = mongoose;

const permissionWithSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['editor', 'viewer'],
    required: true
  },
  endDate: Date
});

module.exports = permissionWithSchema;