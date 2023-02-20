const User = require('../db/schema/user');

exports.find = async () => {
  console.log("call user service findOne")
  const users = await User.find({});
  return users
}