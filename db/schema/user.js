const mongoose = require('mongoose');
const crypto = require('../../js/crypto');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    provider: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    password: String,
    email: {
      type: String,
      required: true,
    },
    email_verified: {
      type: Boolean,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    nickname: String,
    profile_img: String,
    loginFailCount: {
      type: Number,
      default: 0,
    },
    loginDenyDate: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = function (inputPassword, callback) {
  if (inputPassword === crypto.decrypt(this.password)) {
    callback(null, true);
  } else {
    callback('error');
  }
};

module.exports = mongoose.model('User', userSchema);
