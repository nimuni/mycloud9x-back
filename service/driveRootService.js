const driveRootImpl = require('./impl/driveRootServiceImpl');
const fileService = require('./fileService');
const path = require('path');
const fs = require('fs');
const nodeDiskInfo = require('node-disk-info');
const { Error } = require('mongoose');

// 서버 파일시스템 폴더 패스 위치 조회
exports.getServerPath = async (path=process.cwd()) => {
  console.log("call getServerPath")
  console.log(path)
  const childFolderArray = fs.readdirSync(path, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory());
  return {
    currentPathArray: path.split("\\"),
    childFolderArray:childFolderArray
  }
};
// 서버 파일시스템 드라이브 총 용량 조회
exports.getDriveInfo = async (drivePath) => {
  const driveInfoArray = await nodeDiskInfo.getDiskInfo();
  if(drivePath){
    // 총 문자열 중 맨 앞 2글자 추출
    const driveStr = drivePath.slice(0,2).toUpperCase();
    const tempFilterDrive = driveInfoArray.filter(element => element.mounted == driveStr)
    if(tempFilterDrive.length > 0){
      const foundDrive = tempFilterDrive[0]
      return [{
        diskPath: foundDrive.mounted,
        free: foundDrive.available,
        size: foundDrive.used + foundDrive.available,
        available: `${Math.floor(foundDrive.available / (foundDrive.used + foundDrive.available) * 100)}%`
      }]
    } else {
      return []
    }
  } else {
    return driveInfoArray.map(element => {
      return {
        diskPath: element.mounted,
        free: element.available,
        size: element.used + element.available,
        available: `${Math.floor(element.available / (element.used + element.available) * 100)}%`
      }
    })
  }
}
// 서버 파일 시스템에 해당 path에 폴더 생성
exports.mkdir = async (path) => {
  try {
    fs.mkdirSync(path, { recursive: true })
    return;
  } catch (error) {
    throw error;
  }
}


// 루트폴더 모두 조회
exports.getAllDriveRoot = async () => {
  return await driveRootImpl.findAll();
};
// 특정 루트폴더 조회
exports.getDriveRoot = async (_id) => {
  return await driveRootImpl.findOne({_id});
};
exports.insertDriveRoot = async (driveRootObj) => {
  // valid check
  // drive 사이즈 체크
  const driveInfoArray = await nodeDiskInfo.getDiskInfo();
  const driveStr = driveRootObj.path.slice(0,2).toUpperCase();
  const tempFilterDrive = driveInfoArray.filter(element => element.mounted == driveStr)
  const targetDrive = tempFilterDrive[0]
  if(targetDrive.available < driveRootObj.maximumSize){
    throw new Error(`root Drive has no available size. req=${driveRootObj.maximumSize}, available=${targetDrive.available}`)
  }
  
  // 폴더 존재여부 체크
  if (fs.existsSync(driveRootObj.path)) {
    const result = await driveRootImpl.insertOne({
      name: driveRootObj.name,
      path: driveRootObj.path,
      currentSize: 0,
      maximumSize: driveRootObj.maximumSize
    });
    return result;
  } else {
    throw Error(`${driveRootObj.path} is not exist`)
  }
};
exports.updateDriveRoot = async (_id, changeReqObj) => {
  // drive 사이즈 체크
  const driveInfoArray = await nodeDiskInfo.getDiskInfo();
  const driveStr = changeReqObj.path.slice(0,2).toUpperCase();
  const tempFilterDrive = driveInfoArray.filter(element => element.mounted == driveStr)
  const targetDrive = tempFilterDrive[0]
  const currentDriveRoot = await this.getDriveRoot(_id);

  // valid check
  if(currentDriveRoot.currentSize > changeReqObj.maximumSize){
    throw new Error("MaximumSize is smaller than currentSize")
  }
  // 비어있을때만 폴더 위치 변경가능.
  // TODO. 만약 비어있지 않을때 변경할 것이라면, 내부 데이터 참고하는 부분을 모두 변경필요. 
  // moveAllFileToNewDriveRoot 이용해서.
  if(currentDriveRoot.currentSize > 0 && changeReqObj?.path){
    throw new Error(`${currentDriveRoot.name} is not empty`)
  }
  // 변경 폴더 사이즈 체크
  if(changeReqObj?.path && targetDrive.available < changeReqObj.maximumSize){
    throw new Error(`root Drive has no available size. req=${changeReqObj.maximumSize}, available=${targetDrive.available}`)
  }

  // changeObj 세팅
  let changeObj = {};
  if(changeObj.name) changeObj.name = changeObj.name;
  if(changeObj.path) changeObj.path = changeObj.path;
  if(changeObj.currentSize) changeObj.currentSize = changeObj.currentSize;
  if(changeObj.maximumSize) changeObj.maximumSize = changeObj.maximumSize;

  const result = await driveRootImpl.findOneAndUpdate({_id}, changeObj)
  return result;
};
exports.deleteDriveRoot = async (_id) => {
    // drive 사이즈 체크
    const currentDriveRoot = await this.getDriveRoot(_id);

    // valid check
    if(currentDriveRoot.currentSize > 0){
      throw new Error("Can't delete DriveRoot. size is not 0");
    }
    // TODO. 만약 드라이브를 삭제할 것이면, 옮길 드라이브를 선택하고 해당폴더로 옮기는 로직 필요.
    // moveAllFileToNewDriveRoot 이용해서.
    // 혹은 옮기는 것을 우선 수행하고 deleteDriveRoot를 호출할 수 있게 처리.

    // delete Drive
  
  return uploadPath;
};
exports.moveAllFileToNewDriveRoot = async (_fromDriveRootId, _toDriveRootId) => {
  const fromDriveRoot = await this.getDriveRoot(_fromDriveRootId)
  const toDriveRoot = await this.getDriveRoot(_toDriveRootId)

  // 용량체크
  if(fromDriveRoot.currentSize < toDriveRoot.free){
    let fromDriveSize = fromDriveRoot.currentSize;
    let toDriveSize = toDriveRoot.currentSize;

    const regExStr = new RegExp(fromDriveRoot.name);
    const searchObj = {
      currentPath: {$regex: regExStr} 
    }
    const files = await fileService.getAllFile(searchObj);

    // 용량 체크 다시.
    let initValue = 0;
    const fromDriveFilesSize = files.reduce((accumulator, currentValue) => accumulator + currentValue, initValue )
    if(fromDriveFilesSize > toDriveRoot.free) throw new Error("fromDriveFilesSize is bigger than toDrive Free size");

    const moveFilePromiseArray = files.map(file => {
      return new Promise(async (resolve, reject) => {
        // 현재 저장된 모든 파일들을 from에서 to driveRoot로 옮김.
        const currentFileName = file.uuid + file.extention;
        const currentFolderPath = file.currentPath;
        const toFolderPath = toDriveRoot.path;
        const currentPath = path.join(file.currentPath, currentFileName)
        const toPath = path.join(toDriveRoot.path, currentFileName);
        fs.rename(currentPath, toPath, err => {
          reject({
            fileId:file._id,
            error:err
          });
        })

        // 저장된 file 객체들을 조회해서 from drive 문자열을 가지고 있는 것들을 모두 업데이트
        try {
          await fileService.updateFilePath(file._id, toFolderPath);
        } catch (error) {
          // 다시 원래자리로 이동.
          fs.rename(toPath, currentPath, err => {
            reject({
              fileId:file._id,
              error:err
            });
          })
        }

        // fromDriveRoot의 현재 용량 업데이트.
        fromDriveSize -= file.size
        // toDriveRoot의 현재 용량 업데이트.
        toDriveSize += file.size
        
        resolve();
      });
    });
    // promise allSettled 실행
    const resultArray = await Promise.allSettled(moveFilePromiseArray);
    const rejectedArray = resultArray.filter(e => e.status=="rejected");

    // promise array 
    try {
      await this.updateDriveRoot(_fromDriveRootId, {currentSize:fromDriveSize})
      await this.updateDriveRoot(toDriveSize, {currentSize:toDriveSize})
    } catch (error) {
      throw Error
    }

    if(rejectedArray.length == 0) {
      return [];
    } else {
      return rejectedArray;
    }
  } else {
    throw new Error("fromDrive's size is bigger than toDrive Free size");
  }
}