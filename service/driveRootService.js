const driveRootImpl = require('./impl/driveRootServiceImpl');
const util = require('../js/common.util');
const path = require('path');
const fs = require('fs');

// 서버 파일시스템 폴더 패스 위치 조회
exports.getServerPath = (path=process.cwd()) => {
  console.log("call getServerPath")
  console.log(path)
  const childFolderArray = fs.readdirSync(path, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory());
  return {
    currentPathArray: path.split("\\"),
    childFolderArray:childFolderArray
  }
};
// 루트폴더 모두 조회
exports.getAllRootFolder = () => {
  

  let uploadPath = projectUploadsPath;

  return uploadPath;
};
// 특정 루트폴더 조회
exports.getRootFolder = () => {
  const projectUploadsPath = path.join(process.cwd(), 'uploads');

  let uploadPath = projectUploadsPath;
  return uploadPath;
};
exports.insertRootFolder = () => {
  const projectUploadsPath = path.join(process.cwd(), 'uploads');

  let uploadPath = projectUploadsPath;
  return uploadPath;
};
exports.updateRootFolder = () => {
  const projectUploadsPath = path.join(process.cwd(), 'uploads');

  let uploadPath = projectUploadsPath;
  return uploadPath;
};
exports.deleteRootFolder = () => {
  const projectUploadsPath = path.join(process.cwd(), 'uploads');

  let uploadPath = projectUploadsPath;
  return uploadPath;
};