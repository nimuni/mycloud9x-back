const driveFileImpl = require('./impl/driveFileServiceImpl');
const fileImpl = require('./impl/fileServiceImpl');

const { ObjectId } = require('mongoose').Types;
const util = require('../js/common.util');
const path = require('path');


exports.uploadedFile = async (fileObj) => {
  try {
    // User.insertMany([
    //   { name: 'Gourav', age: 20},
    //   { name: 'Kartik', age: 20},
    //   { name: 'Niharika', age: 20}
    // ]).then(function(){
    //   console.log("Data inserted")  // Success
    // }).catch(function(error){
    //   console.log(error)      // Failure
    // });
    // DB에서 가상파일을 끊어내기.
    const findObj = {
      parentFolderId: { $in: folderIds},
      owner: owner
    }
    const folder = await driveFileImpl.deleteMany(findObj)
    return folder;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
exports.findOne = async (folderIds, owner) => {
  try {
    // DB에서 가상파일을 끊어내기.
    const findObj = {
      parentFolderId: { $in: folderIds},
      owner: owner
    }
    const folder = await driveFileImpl.deleteMany(findObj)
    return folder;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
exports.findAll = async (folderIds, owner) => {
  try {
    // DB에서 가상파일을 끊어내기.
    const findObj = {
      parentFolderId: { $in: folderIds},
      owner: owner
    }
    const folder = await driveFileImpl.deleteMany(findObj)
    return folder;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
exports.update = async (folderIds, owner) => {
  try {
    // DB에서 가상파일을 끊어내기.
    const findObj = {
      parentFolderId: { $in: folderIds},
      owner: owner
    }
    const folder = await driveFileImpl.deleteMany(findObj)
    return folder;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
exports.delete = async (folderIds, owner) => {
  try {
    // DB에서 가상파일을 끊어내기.
    const findObj = {
      parentFolderId: { $in: folderIds},
      owner: owner
    }
    const folder = await driveFileImpl.deleteMany(findObj)
    return folder;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
exports.deleteManyFromFolder = async (folderIds, owner) => {
  try {
    // DB에서 가상파일을 끊어내기.
    const findObj = {
      parentFolderId: { $in: folderIds},
      owner: owner
    }
    const folder = await driveFileImpl.deleteMany(findObj)
    return folder;
  } catch (error) {
    console.log(error)
    throw error;
  }
}