const folderImpl = require('./impl/driveFolderServiceImpl');
const fileImpl = require('./impl/driveFileServiceImpl');
const util = require('../js/common.util');

// 현재 경로 가져오기. 상위폴더들까지.
// https://www.mongodb.com/docs/manual/reference/operator/aggregation/graphLookup/#mongodb-pipeline-pipe.-graphLookup
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
exports.mkdir = async (folderName, parentFolderId, userId) => {
  try {
    const folderObj = {
      name: folderName,
      parentFolderId: parentFolderId,
      owner: userId
    }
    return await folderImpl.insertOne(folderObj);
  } catch (error) {
    console.log(error)
    throw error;
  }
}
exports.readDir = async (folderId, role) => {
  try {
    if(role != 'admin' && folderId == 'root') {
      return {files: [], folders: []};
    }
    
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
  try {
    const findFolderObj = {
      _id: folderId
    }
    const changeFolderObj = {
      parentFolderId: parentFolderId
    }
    const folder = await folderImpl.findOneAndUpdate(findFolderObj, changeFolderObj)
    return folder;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
exports.renameDir = async (folderId, newName) => {
  try {
    const findFolderObj = {
      _id: folderId
    }
    const changeFolderObj = {
      name: util.fileNameFilter(newName)
    }
    const folder = await folderImpl.findOneAndUpdate(findFolderObj, changeFolderObj)
    return folder;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
exports.removeDir = async (folderId) => {
  // TODO. 한번에 여러개의 dir를 모두 삭제할 수 있게 해야함.
  // 현재는 하부에 dir이 없는 경우에만 파일 포함해서 모두 삭제.
  try {
    const findFolderObj = {
      _id: folderId
    }
    const findFoldersObj = {
      parentFolderId: folderId
    }
    const findFilesObj = {
      parentFolderId: folderId
    }
    const folders = await folderImpl.findAll(findFoldersObj);
    if(folders.length > 0){
      return false;
    } else {
      const deletedFileCount = await fileImpl.deleteMany(findFilesObj);
      const folder = await folderImpl.findOneAndDelete(findFolderObj);
      console.log("삭제처리 완료")
      console.log(deletedFileCount)
      console.log(folder)
      return true
    }
  } catch (error) {
    console.log(error)
    throw error;
  }
}
exports.addRole = async (folderId, role, userId) => {
  try {
    const findObj = {
      _id: folderId
    }
    const changeObj = {
      $addToSet: {
        sharedWith: {
          user: userId,
          role: role
        }
      }
    }
    const folder = await folderImpl.findOneAndUpdate(findObj, changeObj)
    return folder;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
exports.removeRole = async (folderId, role, userId) => {
  try {
    const findObj = {
      _id: folderId
    }
    const changeObj = {
      $pull: {
        sharedWith: {
          user: userId,
          role: role
        }
      }
    }
    const folder = await folderImpl.findOneAndUpdate(findObj, changeObj)
    return folder;
  } catch (error) {
    console.log(error)
    throw error;
  }
}