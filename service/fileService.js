const path = require('path')
const { v4:uuidv4 } = require('uuid');
const fileImpl = require('./impl/fileServiceImpl')
// 파일 저장 경로
const uploadPath = path.join(process.cwd(), 'uploads');


exports.upload = async (files) => {
  console.log("call fileService upload")
  let filesInfo = [];
  for (let file of files) {
    // 파일 정보 생성
    const fileUUID = uuidv4();
    const fileName = `${fileUUID}${path.extname(file.name)}`;

    // 파일 저장
    await file.mv(path.join(uploadPath, fileName));

    // 파일 정보 저장
    const savedFileData = await fileImpl.insertOne({
      name: file.name,
      uuid: fileUUID,
      mimetype: file.mimetype,
      size: file.size
    })
    // filesInfo.push(savedFileData._id.toString())
    filesInfo.push(savedFileData)
  }
  return filesInfo;
}
exports.getFileData = async (fileId) => {
  const fileData = await fileImpl.findOne({_id:fileId})
  if(!fileData){
    throw new Error("File not found") ;
  }
  const filePath = path.join(uploadPath, `${fileData.uuid}${path.extname(fileData.name)}`);
  return {
    filePath: filePath,
    fileName: fileData.name
  }
}