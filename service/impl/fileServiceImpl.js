const fs = require('fs');
const File = require('../../db/schema/file');

// DB에 파일명을 생성함.
exports.insertOne = async (fileObj) => {
  const newFile = new File(fileObj);
  return await newFile.save();
};
exports.findAll = async (findObj) => {
  return await File.find(findObj);
};
exports.findOne = async (findObj) => {
  return await File.findOne(findObj);
};
exports.findOneAndUpdate = async (findObj, changeObj) => {
  return await File.findOneAndUpdate(findObj, changeObj, { returnOriginal: false });
};
exports.findOneAndDelete = async (findObj) => {
  return await File.findOneAndDelete(findObj);
};
exports.deleteMany = async (findObj) => {
  return await File.deleteMany(findObj);
};
