const User = require('../../db/schema/user');

exports.insertOne = async (userObj) => {
  console.log("call serviceImpl insertOne")
  console.log("userObj=")
  console.log(userObj);
  const newUser = new User(userObj)
  return await newUser.save();
}

exports.findAll = async (findObj, projectionUserObj) => {
  console.log("call serviceImpl findAll")
  console.log("users0")
  const users = await User.find({...findObj}).select(projectionUserObj);
  console.log(users)
  return users;
}

exports.findOne = async (findObj, projectionUserObj) => {
  console.log("call serviceImpl findOne")
  
  return await User.findOne({...findObj}).select(projectionUserObj);
}

exports.findOneAndUpdate = async (findObj, changeObj, projectionUserObj) => {
  console.log("call serviceImpl findOneAndUpdate")
  
  return await User.findOneAndUpdate({...findObj}, {...changeObj}, {returnOriginal:false}).select(projectionUserObj)
}
exports.findOneAndDelete = async (findObj) => {
  console.log("call serviceImpl findOneAndDelete")
  return await User.findOneAndDelete(findObj);
}



