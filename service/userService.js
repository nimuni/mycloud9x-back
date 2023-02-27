const userImpl = require("./impl/userServiceImpl");
const User = require('../db/schema/user');
const { encrypt, decrypt } = require("../js/crypto");
const { isEmpty } = require("../js/common.util");

const projectionUserObj = {
  provider: 1,
  id: 1,
  email: 1,
  email_verified: 1,
  createdAt: 1,
  updatedAt: 1
}
exports.register = async (reqBody) => {
  // provider: ‘google’ // google, ownAPI, kakao
  // id: ‘사용자입력아이디’ // ‘104226972280412090842’
  // password: ‘’ // ownAPI인 경우에만 사용
  // email: ‘사용자입력이메일’
  // email_verified: true / false
  try {
    let newUserObj = {
      provider: reqBody.provider,
      id: reqBody.id,
      email: reqBody.email,
      email_verified: reqBody.email_verified
    };
    if(reqBody?.password) newUserObj.password = encrypt(reqBody.password);

    const user = await userImpl.insertOne(newUserObj)
    return user;
  } catch (error) {
    throw error
  }
}

exports.findAll = async (reqBody) => {
  console.log("call user service find")
  try {
    let findObj = {}
    if(!isEmpty(reqBody?.provider)) 
      findObj.provider = reqBody.provider;
    if(!isEmpty(reqBody?.id)) 
      findObj.id = reqBody.id;
    if(!isEmpty(reqBody?.email)) 
      findObj.email = reqBody.email;
    if(!isEmpty(reqBody?.email_verified)) 
      findObj.email_verified = reqBody.email_verified;

    const users = await userImpl.findAll(findObj, projectionUserObj)
    return users;
  } catch (error) {
    throw error
  }
}

exports.findOne = async (reqBody) => {
  try {
    let findObj = {}
    if(!isEmpty(reqBody?.provider)) 
      findObj.provider = reqBody.provider;
    if(!isEmpty(reqBody?.id)) 
      findObj.id = reqBody.id;
    if(!isEmpty(reqBody?.email)) 
      findObj.email = reqBody.email;
    if(!isEmpty(reqBody?.email_verified)) 
      findObj.email_verified = reqBody.email_verified;

    const user = await userImpl.findOne(findObj, projectionUserObj)
    return user;
  } catch (error) {
    throw error
  }
}

exports.update = async (findObj, reqBody) => {
  try {
    let changeObj = {}
    if(!isEmpty(reqBody?.provider)) 
      changeObj.provider = reqBody.provider;
    if(!isEmpty(reqBody?.id)) 
      changeObj.id = reqBody.id;
    if(!isEmpty(reqBody?.password)) 
      changeObj.password = encrypt(reqBody.password);
    if(!isEmpty(reqBody?.email)) 
      changeObj.email = reqBody.email;
    if(!isEmpty(reqBody?.email_verified)) 
      changeObj.email_verified = reqBody.email_verified;

    const changedUser = await userImpl.findOneAndUpdate(findObj, changeObj, projectionUserObj)
    return changedUser;
  } catch (error) {
    throw error
  }
}