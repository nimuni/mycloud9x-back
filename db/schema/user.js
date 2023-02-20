const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  provider: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  password: String,
  email: {
    type: String,
    required: true,
  },
  email_verified: Boolean
},
{
  timestamps: true,
});

userSchema.methods.comparePassword = function(inputPassword, callback) {
  if (inputPassword === this.password) {
    callback(null, true);
  } else {
    callback('error');
  }
};

module.exports = mongoose.model('User', userSchema);