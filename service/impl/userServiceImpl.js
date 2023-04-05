const User = require('../../db/schema/user');

exports.insertOne = async (userObj) => {
  const newUser = new User(userObj);
  return await newUser.save();
};
exports.findAll = async (findObj, projectionUserObj) => {
  const users = await User.find(findObj).select(projectionUserObj);
  return users;
};
exports.findOne = async (findObj, projectionUserObj) => {
  return await User.findOne(findObj).select(projectionUserObj);
};
exports.findOneAndUpdate = async (findObj, changeObj, projectionUserObj) => {
  return await User.findOneAndUpdate(findObj, changeObj, { returnOriginal: false }).select(projectionUserObj);
};
exports.findOneAndDelete = async (findObj) => {
  return await User.findOneAndDelete(findObj);
};
