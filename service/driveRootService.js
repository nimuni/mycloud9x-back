const driveRootImpl = require('./impl/driveRootServiceImpl');
const util = require('../js/common.util');
const path = require('path');
const fs = require('fs');
const nodeDiskInfo = require('node-disk-info');
const checkDiskSpace = require('check-disk-space').default

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
// TODO. 드라이브 getDiskInfo 이용해서 통일하기.
// 있는 Path에서 앞 문자 잘라서, 조회한 것에서 찾아서 리턴하기
exports.getDriveInfo = async (drivePath) => {
  let disks = [];
  if(drivePath){
    const infoDrive = await checkDiskSpace(drivePath)
    disks.push({
      ...infoDrive,
      available: `${Math.floor(infoDrive.free / infoDrive.size * 100)}%`
    });
  } else {
    let driveInfoArray = await nodeDiskInfo.getDiskInfo()
    for (const drive of driveInfoArray) {
      disks.push({
        diskPath: drive.mounted,
        free: drive.available,
        size: drive.used + drive.available,
        available: `${Math.floor(drive.available / (drive.used + drive.available) * 100)}%`
      });
    }
  }
  console.log(disks)
  return disks
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