const fs = require('fs');
const DriveFolder = require('../../db/schema/driveFolder');

// DB에 폴더명을 생성함.
exports.insertOne = async (folderObj) => {
  return await new DriveFolder(folderObj);
}
exports.findAll = async (findObj) => {
  return await DriveFolder.find(findObj);
}
exports.findOne = async (findObj) => {
  return await DriveFolder.findOne(findObj);
}
exports.findOneAndUpdate = async (findObj, changeObj) => {
  return await DriveFolder.findOneAndUpdate(findObj, changeObj, {returnOriginal:false})
}
exports.findOneAndDelete = async (findObj) => {
  return await DriveFolder.findOneAndDelete(findObj);
}
exports.deleteMany = async (findObj) => {
  return await DriveFolder.deleteMany(findObj);
}