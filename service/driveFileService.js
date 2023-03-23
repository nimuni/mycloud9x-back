const driveFileImpl = require('./impl/driveFileServiceImpl');
const fileService = require('./fileService');
const util = require('../js/common.util');
const path = require('path');


exports.uploadDriveFiles = async (folderId, files, owner) => {
  try {
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
    const uploadedFileInfoArray = await driveFileImpl.insertMany(driveFileArray);
    return uploadedFileInfoArray;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
exports.findOne = async (fileId, owner) => {
  try {
    // DB에서 가상파일을 끊어내기.
    const findObj = {
      _id: fileId,
      owner: owner
    }
    const file = await driveFileImpl.findOne(findObj)
    return file;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
exports.update = async (fileId, changeFileInfoObj, owner) => {
  try {
    // DB에서 가상파일을 끊어내기.
    const findObj = {
      _id: fileId,
      owner: owner
    }
    const file = await driveFolderImpl.findOneAndUpdate(findObj, changeFileInfoObj)
    return file;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
exports.delete = async (fileId, owner) => {
  try {
    // DB에서 가상파일을 끊어내기.
    const findObj = {
      _id: fileId,
      owner: owner
    }
    const file = await driveFileImpl.findOneAndDelete(findObj)
    return file;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
exports.deleteManyFromFolderIds = async (folderIdsArray, owner) => {
  try {
    // DB에서 가상파일을 끊어내기.
    const findObj = {
      parentFolderId: { $in: folderIdsArray},
      owner: owner
    }
    const file = await driveFileImpl.deleteMany(findObj)
    return file;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
exports.grantPermission = async (fileId, permissionObj, owner) => {
  try {
    const findObj = {
      _id: fileId,
      owner: owner
    }
    const changeObj = {
      $addToSet: {
        permissionWith: permissionObj
      }
    }
    const file = await drivefileImpl.findOneAndUpdate(findObj, changeObj)
    return file;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
exports.revokePermission = async (fileId, permissionObj, owner) => {
  try {
    const findObj = {
      _id: fileId,
      owner: owner
    }
    const changeObj = {
      $pull: {
        permissionWith: permissionObj
      }
    }
    const file = await driveFileImpl.findOneAndUpdate(findObj, changeObj)
    return file;
  } catch (error) {
    console.log(error)
    throw error;
  }
}