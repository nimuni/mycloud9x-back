const fs = require('fs');
const DriveCapacity = require('../../db/schema/driveCapacity');

// DB에 폴더명을 생성함.
exports.insertOne = async (driveCapacityObj) => {
  const newDriveFolder = new DriveCapacity(driveCapacityObj);
  return await newDriveFolder.save();
};
exports.findAll = async (findObj) => {
  return await DriveCapacity.find(findObj);
};
exports.findOne = async (findObj) => {
  return await DriveCapacity.findOne(findObj);
};
exports.findOneAndUpdate = async (findObj, changeObj) => {
  return await DriveCapacity.findOneAndUpdate(findObj, changeObj, { returnOriginal: false });
};
exports.findOneAndDelete = async (findObj) => {
  return await DriveCapacity.findOneAndDelete(findObj);
};