const driveCapacityImpl = require('./impl/driveCapacityServiceImpl');
const util = require('../js/common.util');
const path = require('path');

exports.getDriveCapacity = async (_id) => {
  try {
    return await driveCapacityImpl.findOne({_id: _id})
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.getAllDriveCapacity = async () => {
  try {
    return await driveCapacityImpl.findAll()
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.insertDriveCapacity = async (driveCapacityObj) => {
  try {
    return await driveCapacityImpl.insertOne(driveCapacityObj)
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.deleteDriveCapacity = async (_id) => {
  try {
    // return await driveCapacityImpl.findOneAndDelete//
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.increaseUsedCapacity = async (folderId, files, owner) => {
  try {

  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.decreaseUsedCapacity = async (folderId, files, owner) => {
  try {

  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.increaseTotalCapacity = async (folderId, files, owner) => {
  try {

  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.decreaseTotalCapacity = async (folderId, files, owner) => {
  try {

  } catch (error) {
    console.log(error);
    throw error;
  }
};