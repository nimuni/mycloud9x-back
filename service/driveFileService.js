const driveFileImpl = require('./impl/driveFileServiceImpl');
const fileService = require('./fileService');
const util = require('../js/common.util');
const path = require('path');

exports.uploadDriveFiles = async (folderId, files, owner) => {
  try {
    console.log("call uploadDriveFiles in driveFileService")
    // 파일들을 업로드한 후
    const uploadfileArray = await fileService.upload(files);
    console.log("uploadfileArray")
    console.log(uploadfileArray)
    // 업로드된 파일들의 정보를 기반으로, driveFile 정보를 DB에 입력
    const driveFileArray = uploadfileArray.map((element) => {
      return {
        parentFolderId: folderId,
        name: element.name,
        extention: path.extname(element.name),
        size: element.size,
        owner: owner,
        savedFileId: element._id,
      };
    });
    console.log("driveFileArray")
    console.log(driveFileArray)
    const uploadedFileInfoArray = await driveFileImpl.insertMany(driveFileArray);
    return uploadedFileInfoArray;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.findOne = async (fileId, owner) => {
  try {
    const findObj = {
      _id: fileId,
      owner: owner,
    };
    const file = await driveFileImpl.findOne(findObj);
    return file;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.update = async (fileId, changeFileInfoObj, owner) => {
  try {
    const findObj = {
      _id: fileId,
      owner: owner,
    };
    const file = await driveFolderImpl.findOneAndUpdate(findObj, changeFileInfoObj);
    return file;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.delete = async (fileId, owner) => {
  try {
    const findObj = {
      _id: fileId,
      owner: owner,
    };
    const file = await driveFileImpl.findOneAndDelete(findObj);
    console.log(file);
    const result = await fileService.removeFile(file.savedFileId);
    if (result) {
      return file;
    } else {
      throw new Error('실제파일 삭제 오류');
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.deleteManyFromFolderIds = async (folderIdsArray, owner) => {
  try {
    console.log("call deleteManyFromFolderIds")
    const findObj = {
      parentFolderId: { $in: folderIdsArray },
      owner: owner,
    };
    const foundFiles = await driveFileImpl.findAll(findObj);
    const files = await driveFileImpl.deleteMany(findObj);
    console.log("foundFiles");
    console.log(foundFiles);
    console.log("files deletedCount");
    console.log(files.deletedCount);
    const savedFileIdArray = foundFiles.map((e) => e.savedFileId);
    console.log("savedFileIdArray");
    console.log(savedFileIdArray);
    const result = await fileService.removeFiles(savedFileIdArray);
    // TODO. delete 실제파일 여러개
    console.log("result.length");
    console.log(result.length);
    console.log(result.length + files.deletedCount);
    return result.length + files.deletedCount;
  } catch (error) {
    console.log("in error")
    console.log(error);
    throw error;
  }
};
exports.grantPermission = async (fileId, permissionObj, owner) => {
  try {
    const findObj = {
      _id: fileId,
      owner: owner,
    };
    const changeObj = {
      $addToSet: {
        permissionWith: permissionObj,
      },
    };
    const file = await drivefileImpl.findOneAndUpdate(findObj, changeObj);
    return file;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.revokePermission = async (fileId, permissionObj, owner) => {
  try {
    const findObj = {
      _id: fileId,
      owner: owner,
    };
    const changeObj = {
      $pull: {
        permissionWith: permissionObj,
      },
    };
    const file = await driveFileImpl.findOneAndUpdate(findObj, changeObj);
    return file;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
