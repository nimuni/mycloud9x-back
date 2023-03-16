const fs = require('fs');
const File = require('../../db/schema/file');

// DB에 폴더명을 생성함.
exports.insertOne = async (fileObj) => {
  return await new File(fileObj);
}
exports.findAll = async (findObj) => {
  return await File.find(findObj);
}
exports.findOne = async (findObj) => {
  return await File.findOne(findObj);
}
exports.findOneAndUpdate = async (findObj, changeObj) => {
  return await File.findOneAndUpdate(findObj, changeObj, {returnOriginal:false})
}
exports.findOneAndDelete = async (findObj) => {
  return await File.findOneAndDelete(findObj);
}