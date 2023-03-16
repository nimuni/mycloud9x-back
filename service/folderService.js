const folderImpl = require('./impl/folderServiceImpl');
const fileImpl = require('./impl/fileServiceImpl');
const util = require('../js/common.util');

// 현재 경로 가져오기. 상위폴더들까지.
// exports.getRelativePath = async (folderId) => {
//   try {
//     const currentFolder = await folderImpl.findOne({_id:folderId});
//     let tempParentFolderId = currentFolder.parentFolderId;

//     while(tempParentFolderId != "root"){
//       await folderImpl.findOne({parentFolderId:tempParentFolderId})
//     }
//   } catch (error) {
//     console.log(error)
//     throw error
//   }
// }
exports.mkdir = async (folderName, parentFolderId) => {
  try {
    const folderObj = {
      name: folderName,
      parentFolderId: parentFolderId
    }
    return await folderImpl.insertOne(folderObj);
  } catch (error) {
    console.log(error)
    throw error;
  }
}
exports.readDir = async (folderId) => {
  try {
    const findObj = {
      parentFolderId: folderId
    }
    const files = await fileImpl.findAll(findObj);
    const folders = await folderImpl.findAll(findObj);
    return {
      files: files,
      folders: folders
    }
  } catch (error) {
    console.log(error)
    throw error;
  }
}
exports.mvdir = async (folderId, parentFolderId) => {
  // TODO. 한번에 여러개의 dir를 모두 옮길 수 있게 해야함.
  try {
    const findFolferObj = {
      _id: folderId
    }
    const changeFolderObj = {
      parentFolderId: parentFolderId
    }
    const folder = await folderImpl.findOneAndUpdate(findFolferObj, changeFolderObj)
    return folder;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
exports.renameDir = async (folderId, newName) => {
  try {
    const findFolferObj = {
      _id: folderId
    }
    const changeFolderObj = {
      name: util.fileNameFilter(newName)
    }
    const folder = await folderImpl.findOneAndUpdate(findFolferObj, changeFolderObj)
    return folder;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
exports.removeDir = async (folderId) => {
  // TODO. 한번에 여러개의 dir를 모두 옮길 수 있게 해야함.
  // 하위 파일들을 다 삭제해야함.
  try {
    const findFolferObj = {
      _id: folderId
    }
    const changeFolderObj = {
      name: util.fileNameFilter(newName)
    }
    const folder = await folderImpl.findOneAndDelete(findFolferObj, changeFolderObj)
    return folder;
  } catch (error) {
    console.log(error)
    throw error;
  }
}