const driveFolderImpl = require('./impl/driveFolderServiceImpl');
const driveFileImpl = require('./impl/driveFileServiceImpl');
const util = require('../js/common.util');
const path = require('path');

// 현재 경로 가져오기. 상위폴더들까지.
// https://www.mongodb.com/docs/manual/reference/operator/aggregation/graphLookup/#mongodb-pipeline-pipe.-graphLookup
exports.getRelativePath = async (currentFolderId, owner) => {
  try {
    console.log("call getRelativePath")
    console.log(currentFolderId)

    // 1번방법
    // const pipeline = [
    //   // 현재 폴더를 조회하기 위한 match stage
    //   // { $match: { _id: ObjectId(currentFolderId) }},
    //   { $match: { owner: ObjectId(owner) }},

    //   // 필요한 필드만을 선택하기 위한 project stage
    //   { $project: { _id: 1, parentFolderId: 1, name: 1 }},

    //   // 최상위 폴더까지 상위 폴더를 조회하기 위한 graphLookup stage
    //   {
    //     $graphLookup: {
    //       from: "drivefolders",
    //       startWith: "$parentFolderId",
    //       connectFromField: "parentFolderId",
    //       connectToField: "_id",
    //       as: "parentFolders",
    //       maxDepth: 100,
    //       restrictSearchWithMatch: { parentFolderId: { $eq: "root" } }
    //     }
    //   },
    // ];
    // let result = await folderImpl.pipeline(pipeline);

    // 2번방법
    // const pipeline = [
    //   // 현재 폴더부터 상위 폴더까지 조회하기 위한 unwind stage
    //   { $match: { owner: ObjectId(owner) }},
    //   {
    //     $graphLookup: {
    //       from: "drivefolders",
    //       startWith: "$parentFolderId",
    //       connectFromField: "parentFolderId",
    //       connectToField: "_id",
    //       as: "parentFolders",
    //       maxDepth: 100,
    //       restrictSearchWithMatch: { parentFolderId: { $eq: "root" } }
    //     }
    //   },
    //   // 결과를 역순으로 정렬하여 현재 폴더부터 시작하도록 함
    //   { $sort: { "parentFolders.depth": 1 } },
    //   // 필요한 필드만을 선택하기 위한 project stage
    //   // { $project: { _id: 1, parentFolderId: 1, name: 1, depth: { $size: "$parentFolders" } } }
    // ];
    // let result = await folderImpl.pipeline(pipeline);
    // console.log("pipeline result=")
    // console.log(result)

    // 3번방법
    // 주먹구구식. TODO 추후 바꿔야함.
    let currentId = currentFolderId;
    let tempParentFolderId = null;
    let folderNameArray = [];
    while(tempParentFolderId != "root"){
      let folderInfo = await driveFolderImpl.findOne({_id:currentId})
      currentId = folderInfo.parentFolderId;
      folderNameArray.push(folderInfo.name);
      tempParentFolderId = folderInfo.parentFolderId;
    }
    folderNameArray.reverse();
    let resultPath = "\\";
    folderNameArray.forEach(element => {
      resultPath = path.join(resultPath, element)
    });
    
    return resultPath;
  } catch (error) {
    console.log(error)
    throw error
  }
}
exports.getChildFolderIds = async (currentFolderId, owner) => {
  try {
    const findObj = {
      owner: owner
    }
    // DB쿼리 1회
    const allFolderArray = await driveFolderImpl.findAll(findObj);

    // 검색 결과 자식들의 FolderId를 입력하는 변수
    let searchIds = [];
    searchIds.push(currentFolderId)

    // 검색결과 나타난 임시 자식Array
    let resultFolders = [];

    do {
      // 현재 검색용 IDs array의 0번아이디 검색
      let tempFolders = allFolderArray.filter(element => element.parentFolderId == searchIds[0])
      let tempFildersId = tempFolders.map(element => element._id);
      searchIds.push(...tempFildersId);

      // 찾은 폴더의 결과물들을 추가.
      resultFolders.push(...tempFolders);

      // 검색완료된 0번째 요소 제거
      searchIds.splice(0, 1);
    } while (searchIds.length > 0);

    console.log("getChildFolderIds result")
    console.log(searchIds)
    console.log(resultFolders)

    return resultFolders.map(e => e._id);
  } catch (error) {
    console.log(error)
    throw error;
  }
}
exports.mkdir = async (folderName, parentFolderId, userId) => {
  try {
    const folderObj = {
      name: folderName,
      parentFolderId: parentFolderId == "root" ? "root" : parentFolderId,
      owner: userId
    }
    return await driveFolderImpl.insertOne(folderObj);
  } catch (error) {
    console.log(error)
    throw error;
  }
}
exports.readDirInfo = async (findObj) => {
  try {
    const folder = await driveFolderImpl.findOne(findObj);
    return folder
  } catch (error) {
    console.log(error)
    throw error;
  }
}
exports.readDir = async (findObj) => {
  try {
    console.log("call readDir in driveFolderService")
    console.log(findObj)
    const files = await driveFileImpl.findAll(findObj);
    const folders = await driveFolderImpl.findAll(findObj);
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
      parentFolderId: parentFolderId == "root" ? "root" : parentFolderId
    }
    const folder = await driveFolderImpl.findOneAndUpdate(findFolderObj, changeFolderObj)
    return folder;
  } catch (error) {
    console.log(error)
    throw error;
  }
}
exports.modifyDir = async (folderId, _changeFolderObj) => {
  try {
    const findFolderObj = {
      _id: folderId
    }
    let changeFolderObj = {}
    if(_changeFolderObj.name) changeFolderObj.name = util.fileNameFilter(_changeFolderObj.name)
    if(_changeFolderObj.parentFolderId) changeFolderObj.parentFolderId = _changeFolderObj.parentFolderId
   
    const folder = await driveFolderImpl.findOneAndUpdate(findFolderObj, changeFolderObj)
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
    const folders = await driveFolderImpl.findAll(findFoldersObj);
    if(folders.length > 0){
      return false;
    } else {
      const deletedFileCount = await driveFileImpl.deleteMany(findFilesObj);
      const folder = await driveFolderImpl.findOneAndDelete(findFolderObj);
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
    const folder = await driveFolderImpl.findOneAndUpdate(findObj, changeObj)
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
    const folder = await driveFolderImpl.findOneAndUpdate(findObj, changeObj)
    return folder;
  } catch (error) {
    console.log(error)
    throw error;
  }
}