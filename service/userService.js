const userImpl = require("./impl/userServiceImpl");
const { encrypt, decrypt } = require("../js/crypto");
const { isEmpty, generateRandomString } = require("../js/common.util");
const mailImpl = require("./impl/mailServiceImpl")

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

// exports.delete = async (findObj, reqBody) => {
//   try {
//     // TODO. 사용여부만 false로 바꾸는 식으로 진행예정. 실제삭제x 데이터 업데이트만.
//     let changeObj = {}
//     if(!isEmpty(reqBody?.provider)) 
//       changeObj.provider = reqBody.provider;
//     if(!isEmpty(reqBody?.id)) 
//       changeObj.id = reqBody.id;
//     if(!isEmpty(reqBody?.password)) 
//       changeObj.password = encrypt(reqBody.password);
//     if(!isEmpty(reqBody?.email)) 
//       changeObj.email = reqBody.email;
//     if(!isEmpty(reqBody?.email_verified)) 
//       changeObj.email_verified = reqBody.email_verified;

//     const changedUser = await userImpl.findOneAndUpdate(findObj, changeObj, projectionUserObj)
//     return changedUser;
//   } catch (error) {
//     throw error
//   }
// }


exports.findAccount = async (type, reqBody) => {
  try {
    let findObj = {}
    findObj.email = reqBody.email;
    const user = await userImpl.findOne(findObj, projectionUserObj);

    let subject, html;
    switch (type) {
      case "id":
        console.log("step id")
        subject = "mycloud9x 고객님의 ID 입니다."
        html = await mailImpl.getContents("id", user)
        console.log(html)
        await mailImpl.sendMail(reqBody.email, {subject, html})
        break;
      case "pwd":
        console.log("step pwd")
        let tempPassword = generateRandomString(10);
        await userImpl.findOneAndUpdate({id:user.id}, {password:encrypt(tempPassword)}, projectionUserObj);

        subject = "mycloud9x 고객님의 임시 비밀번호가 설정되었습니다."
        html = await mailImpl.getContents("pwd", {password:tempPassword})
        await mailImpl.sendMail(reqBody.email, {subject, html})
        break;
      default:
        throw new Error("no findAccount type")
    }
    return
  } catch (error) {
    console.log("error in findAccount")
    console.log(error)
    throw error
  }
}