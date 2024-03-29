const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fileImpl = require('./impl/fileServiceImpl');
const fs = require('fs');

// 파일 저장 경로.
exports.getUploadablePath = () => {
  // TODO. 가변적으로 변경되어야 함.
  // ex) 관리자가 지정해둔 폴더의 용량이 꽉차지 않았는지 계산 후 공간이 남는 위치로
  // 자동지정할 수 있도록 함수 구현.
  const projectUploadsPath = path.join(process.cwd(), 'uploads');

  let uploadPath = projectUploadsPath;
  // 1. DB?에서 지정된 폴더경로 불러오기
  // 2. 폴더들의 지정된 용량, 남은 저장공간 계산
  // 3. 여유가 있으면 폴더경로 리턴

  return uploadPath;
};
exports.upload = async (files) => {
  console.log('call fileService upload');
  let filesInfo = [];
  for (let file of files) {
    // 파일 정보 생성
    const fileUUID = uuidv4();
    const fileName = `${fileUUID}${path.extname(file.name)}`;

    // 파일 저장
    const folderPath = this.getUploadablePath()
    const filePath = path.join(folderPath, fileName);
    await file.mv(filePath);

    // 파일 정보 저장
    const savedFileData = await fileImpl.insertOne({
      name: file.name,
      uuid: fileUUID,
      mimetype: file.mimetype,
      extention: path.extname(file.name),
      size: file.size,
      currentPath: folderPath,
    });
    // filesInfo.push(savedFileData._id.toString())
    filesInfo.push(savedFileData);
  }
  return filesInfo;
};
exports.getAllFile = async (searchObj) => {
  const filesData = await fileImpl.findAll(searchObj);
  if (!filesData) {
    throw new Error('File not found');
  }
  return filesData;
};
exports.getFile = async (fileId) => {
  const fileData = await fileImpl.findOne({ _id: fileId });
  if (!fileData) {
    throw new Error('File not found');
  }
  return fileData;
};
exports.getFilePath = async (fileId) => {
  const fileData = await fileImpl.findOne({ _id: fileId });
  if (!fileData) {
    throw new Error('File not found');
  }
  const fileName = `${fileData.name}`;
  const filePath = path.join(fileData.currentPath, fileName);
  return filePath;
  // return {
  //   filePath: filePath,
  //   fileName: fileData.name
  // }
};
exports.updateFilePath = async (fileId, newFolderPath) => {
  const fileData = await fileImpl.findOneAndUpdate({ _id: fileId }, {currentPath: newFolderPath});
  if (!fileData) {
    throw new Error('File not found');
  }
  return true;
};
exports.removeFile = async (fileId) => {
  try {
    const filePath = await this.getFilePath(fileId);
    fs.unlinkSync(filePath);
    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.removeFiles = async (savedFileIdArray) => {
  try {
    const deletePromises = savedFileIdArray.map((id) => {
      return new Promise(async (resolve, reject) => {
        try {
          resolve(await this.removeFile(id));
        } catch (error) {
          reject(error);
        }
      });
    });
    let result = await Promise.all(deletePromises);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
