const fs = require('fs');
const DriveFile = require('../../db/schema/driveFile');

// DB에 파일명을 생성함.
exports.insertOne = async (fileObj) => {
  return await new DriveFile(fileObj);
}
exports.findAll = async (findObj) => {
  return await DriveFile.find(findObj);
}
exports.findOne = async (findObj) => {
  return await DriveFile.findOne(findObj);
}
exports.findOneAndUpdate = async (findObj, changeObj) => {
  return await DriveFile.findOneAndUpdate(findObj, changeObj, {returnOriginal:false})
}
exports.findOneAndDelete = async (findObj) => {
  return await DriveFile.findOneAndDelete(findObj);
}
exports.deleteMany = async (findObj) => {
  return await DriveFile.deleteMany(findObj);
}