const fs = require('fs');
const driveRoot = require('../../db/schema/driveRoot');

// DB에 폴더명을 생성함.
exports.insertOne = async (driveRootObj) => {
  const newDriveFolder = new driveRoot(driveRootObj);
  return await newDriveFolder.save();
};
exports.findAll = async (findObj) => {
  return await driveRoot.find(findObj);
};
exports.findOne = async (findObj) => {
  return await driveRoot.findOne(findObj);
};
exports.findOneAndUpdate = async (findObj, changeObj) => {
  return await driveRoot.findOneAndUpdate(findObj, changeObj, { returnOriginal: false });
};
exports.findOneAndDelete = async (findObj) => {
  return await driveRoot.findOneAndDelete(findObj);
};