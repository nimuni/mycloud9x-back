const fs = require('fs');
const Folder = require('../../db/schema/folder');

// DB에 폴더명을 생성함.
exports.insertOne = async (folderObj) => {
  return await new Folder(folderObj);
}
exports.findAll = async (findObj) => {
  return await Folder.find(findObj);
}
exports.findOne = async (findObj) => {
  return await Folder.findOne(findObj);
}
exports.findOneAndUpdate = async (findObj, changeObj) => {
  return await Folder.findOneAndUpdate(findObj, changeObj, {returnOriginal:false})
}
exports.findOneAndDelete = async (findObj) => {
  return await Folder.findOneAndDelete(findObj);
}