const mongoose = require('mongoose');
const { Schema } = mongoose;
const serverDirectorySchema = new Schema({
  path: {
    type: String,
    required: true
  },
},
{
  timestamps: true,
});

module.exports = mongoose.model('ServerDirectory', serverDirectorySchema);