const driveRootImpl = require('./impl/driveRootServiceImpl');
const util = require('../js/common.util');
const path = require('path');
const fs = require('fs');
const nodeDiskInfo = require('node-disk-info');

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
// 루트폴더 모두 조회
exports.getAllRootFolder = async () => {
  

  let uploadPath = projectUploadsPath;

  return uploadPath;
};
// 특정 루트폴더 조회
exports.getRootFolder = async () => {
  const projectUploadsPath = path.join(process.cwd(), 'uploads');

  let uploadPath = projectUploadsPath;
  return uploadPath;
};
exports.insertRootFolder = async () => {
  const projectUploadsPath = path.join(process.cwd(), 'uploads');

  let uploadPath = projectUploadsPath;
  return uploadPath;
};
exports.updateRootFolder = async () => {
  const projectUploadsPath = path.join(process.cwd(), 'uploads');

  let uploadPath = projectUploadsPath;
  return uploadPath;
};
exports.deleteRootFolder = async () => {
  const projectUploadsPath = path.join(process.cwd(), 'uploads');

  let uploadPath = projectUploadsPath;
  return uploadPath;
};