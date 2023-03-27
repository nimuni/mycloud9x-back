const driveFolderImpl = require('./impl/driveFolderServiceImpl');
const driveFileImpl = require('./impl/driveFileServiceImpl');
const util = require('../js/common.util');
const path = require('path');

// 현재 경로 객체 가져오기.
exports.getRelativePath = async (currentFolderId, owner) => {
  try {
    const findObj = {
      owner: owner,
    };

    // DB쿼리 1회 - 한 사람이 가지는 folder의 수가 적기때문에, 해당 사람의 모든폴더 한번에 조회
    const allFolderArray = await driveFolderImpl.findAll(findObj);

    // 검색할 FolderId를 저장하는 변수
    let searchIds = [];
    searchIds.push(currentFolderId);

    // 검색결과 나타난 Array
    let resultFolders = [];

    while(searchIds.length > 0){
      let foundFolder = allFolderArray.find((element) => element._id == searchIds[0]);
      console.log(foundFolder)

      if(foundFolder.parentFolderId != "root") {
        searchIds.push(foundFolder.parentFolderId);
      }
      // resultFolders.push(foundFolder)
      resultFolders.splice(0, 0, foundFolder) // push는 뒤에되기 때문에 splice로 앞에 입력
      
      // 검색완료된 0번째 요소 제거
      searchIds.splice(0, 1);
    }

    console.log('getRelativePath result');
    let result = resultFolders.map((e) => {
      return {
        _id: e._id,
        name: e.name,
        parentFolderId: e.parentFolderId,
        owner: e.owner
      }
    })

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
// 현재 폴더 아이디의 자식폴더 객체 어레이를 가져오기
exports.childFolders = async (currentFolderId, owner) => {
  try {
    const findObj = {
      owner: owner,
      parentFolderId: currentFolderId
    };

    // DB쿼리 1회 - 한 사람이 가지는 folder의 수가 적기때문에, 해당 사람의 모든폴더 한번에 조회
    const allFolderArray = await driveFolderImpl.findAll(findObj);

    console.log('getRelativePath result');
    let result = allFolderArray.map((e) => {
      return {
        _id: e._id,
        name: e.name,
        parentFolderId: e.parentFolderId,
        owner: e.owner
      }
    })

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.getDescendantFolderIds = async (currentFolderId, owner) => {
  try {
    const findObj = {
      owner: owner,
    };
    // DB쿼리 1회
    const allFolderArray = await driveFolderImpl.findAll(findObj);

    // 검색 결과 자식들의 FolderId를 입력하는 변수
    let searchIds = [];
    searchIds.push(currentFolderId);

    // 검색결과 나타난 임시 자식Array
    let resultFolders = [];

    do {
      // 현재 검색용 IDs array의 0번아이디 검색
      let tempFolders = allFolderArray.filter((element) => element.parentFolderId == searchIds[0]);
      let tempFildersId = tempFolders.map((element) => element._id);
      searchIds.push(...tempFildersId);

      // 찾은 폴더의 결과물들을 추가.
      resultFolders.push(...tempFolders);

      // 검색완료된 0번째 요소 제거
      searchIds.splice(0, 1);
    } while (searchIds.length > 0);

    console.log('getDescendantFolderIds result');
    console.log(searchIds);
    console.log(resultFolders);

    return resultFolders.map((e) => e._id);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.mkdir = async (folderName, parentFolderId, userId) => {
  try {
    const folderObj = {
      name: folderName,
      parentFolderId: parentFolderId == 'root' ? 'root' : parentFolderId,
      owner: userId,
    };
    return await driveFolderImpl.insertOne(folderObj);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.readDirInfo = async (findObj) => {
  try {
    const folder = await driveFolderImpl.findOne(findObj);
    return folder;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.readDir = async (findObj) => {
  try {
    console.log('call readDir in driveFolderService');
    console.log(findObj);
    const files = await driveFileImpl.findAll(findObj);
    const folders = await driveFolderImpl.findAll(findObj);
    return {
      files: files,
      folders: folders,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.mvdir = async (folderId, parentFolderId) => {
  try {
    const findFolderObj = {
      _id: folderId,
    };
    const changeFolderObj = {
      parentFolderId: parentFolderId == 'root' ? 'root' : parentFolderId,
    };
    const folder = await driveFolderImpl.findOneAndUpdate(findFolderObj, changeFolderObj);
    return folder;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.modifyDir = async (folderId, _changeFolderObj) => {
  try {
    const findFolderObj = {
      _id: folderId,
    };
    let changeFolderObj = {};
    if (_changeFolderObj.name) changeFolderObj.name = _changeFolderObj.name;
    if (_changeFolderObj.parentFolderId) changeFolderObj.parentFolderId = _changeFolderObj.parentFolderId;

    const folder = await driveFolderImpl.findOneAndUpdate(findFolderObj, changeFolderObj);
    return folder;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.removeDir = async (folderId) => {
  // TODO. 한번에 여러개의 dir를 모두 삭제할 수 있게 해야함.
  // 현재는 하부에 dir이 없는 경우에만 파일 포함해서 모두 삭제.
  try {
    const findFolderObj = {
      _id: folderId,
    };
    const findFoldersObj = {
      parentFolderId: folderId,
    };
    const findFilesObj = {
      parentFolderId: folderId,
    };
    const folders = await driveFolderImpl.findAll(findFoldersObj);
    if (folders.length > 0) {
      return false;
    } else {
      const deletedFileCount = await driveFileImpl.deleteMany(findFilesObj);
      const folder = await driveFolderImpl.findOneAndDelete(findFolderObj);
      console.log('삭제처리 완료');
      console.log(deletedFileCount);
      console.log(folder);
      return true;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.grantPermission = async (folderId, permissionObj, owner) => {
  try {
    // TODO. grant 존재해도 추가로 생성됨.
    const findObj = {
      _id: folderId,
      owner: owner,
    };
    const changeObj = {
      $addToSet: {
        permissionWith: permissionObj,
      }
    };
    const folder = await driveFolderImpl.findOneAndUpdate(findObj, changeObj);
    return folder;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.revokePermission = async (folderId, permissionObj, owner) => {
  try {
    const findObj = {
      _id: folderId,
      owner: owner,
    };
    const changeObj = {
      $pull: {
        permissionWith: permissionObj,
      },
    };
    const folder = await driveFolderImpl.findOneAndUpdate(findObj, changeObj);
    return folder;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
