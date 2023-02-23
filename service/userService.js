const User = require('../db/schema/user');
const projectionUserObj = {
  provider: 1,
  id: 1,
  email: 1,
  email_verified: 1,
  createdAt: 1,
  updatedAt: 1
}

exports.find = async (findObj={}) => {
  console.log("call user service find")
  const users = await User.find({...findObj}).select(projectionUserObj);
  return users;
}

exports.findOne = async (findObj={}) => {
  console.log("call user service findOne")
  const user = await User.findOne({...findObj}).select(projectionUserObj);
  return user;
}

exports.register = async (userObj={}) => {
  // provider: ‘google’ // google, ownAPI, kakao
  // id: ‘사용자입력아이디’ // ‘104226972280412090842’
  // password: ‘’ // ownAPI인 경우에만 사용
  // email: ‘사용자입력이메일’
  // email_verified: true / false
  console.log("call user service register")
  const newUser = new User({
    ...userObj 
  })
  return await newUser.save();
}

exports.update = async (findObj={}, changeObj={}) => {
  console.log("call user service update")
  return await User.findOneAndUpdate({...findObj}, {...changeObj}, {returnOriginal:false}).select(projectionUserObj)
}