const driveFileImpl = require('./impl/driveFileServiceImpl');
const fileService = require('./fileService');
const util = require('../js/common.util');
const path = require('path');


exports.uploadDriveFiles = async (folderId, files, owner) => {
  try {
    console.log("call uploadDriveFiles")
    console.log(folderId)
    console.log(files)
    const uploadfileArray = await fileService.upload(files);
    const driveFileArray = uploadfileArray.map(element => {
      return {
        parentFolderId: folderId,
        name: element.name,
        extention: path.extname(element.name),
        size: element.size,
        owner: owner,
        savedFileId: element._id,
      }
    })
    console.log(uploadfileArray)
    console.log(driveFileArray)
    const result = await driveFileImpl.insertMany(driveFileArray);
    console.log("in service result")
    console.log(result)

    return result;
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