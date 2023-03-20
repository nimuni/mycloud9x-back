const router = require('express').Router();
const fileService = require('../service/fileService');
const driveFileService = require('../service/driveFileService');
const driveFolderService = require('../service/driveFolderService');
const { verifyJwt } = require("../js/jwt");

////////////////////////////// 
// 파일 다운로드 및 업로드 기본
//////////////////////////////
router.post('/uploadToDrive/:_id', async (req, res, next) => {
  try {
    // drivefolder 스키마의 id를 받아서 파일 업로드 후 drive파일
    // TODO. 파일 업로드 후 파일 id 반환.
    console.log(req.files.filename); // the uploaded file object
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});
router.get('/downloadFromDrive/:_id', async (req, res, next) => {
  try {
    // driveFile 스키마
    // TODO. 파일 업로드 후 파일 id 반환.
    console.log(req.files.filename); // the uploaded file object
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});

////////////////////////////// 
// 폴더 처리
//////////////////////////////
router.get('/folder/:_id', verifyJwt, async (req, res, next) => {
  try {
    console.log("call /folder/:_id")
    console.log(req.params._id)
    console.log(req.user.role)
    const folder = await driveFolderService.readDir(req.params._id, req.user.role)
    console.log(folder)
    res.send(folder)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});
router.post('/folder', async (req, res, next) => {
  try {
    const { name, parentFolderId } = req.body;
    const owner = req.user._id
  
    if(parentFolderId == "root") res.status(500).json({ message: "parentFolderId can not be root" });
    
    const folder = await driveFolderService.mkdir(name, parentFolderId, owner);
    // 해당 폴더경로 및 폴더명으로 폴더 생성
    // data값으로 path를 전송해줘야함.
    res.send(folder);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});
router.put('/folder/:_id', async (req, res, next) => {
  try {
    // 전송된 폴더경로 및 폴더명으로 폴더변경. 경로,이름변경. 
    // 이동시 하위파일까지 같이 이동
    const { name, parentFolderId, owner} = req.body;
  
    const folder = await driveFolderService.mkdir(req.params.id, {name, parentFolderId, owner});
    // 해당 폴더경로 및 폴더명으로 폴더 생성
    // data값으로 path를 전송해줘야함.
    res.send(folder);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});
router.delete('/folder/:_id', async (req, res, next) => {
  try {
    // 전송된 폴더경로 및 폴더명으로 폴더 삭제.
    // 삭제시 하위파일 존재하면 하위파일까지 전부 날려야함.
    res.send('respond with a resource5');
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});


////////////////////////////// 
// 파일처리
//////////////////////////////
router.get('/file/:fileId', async (req, res, next) => {
  try {
    // 해당 경로의 파일 정보를 리턴
    // userFilePath 는 유저의 상대 하위 폴더 경로 및 파일명, 확장자명까지 포함
    // ex) http://localhost/myFolder1/abcd.png
    // /myFolder1/abcd.png 가 변수값으로 들어옴
    res.send('respond with a resource1');
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});
router.post('/uploadFile/:folderId', async (req, res, next) => {
  try {
    // 인자값으로 경로 및 파일명을 받아서(urlEncode 필수)
    // 혹은 userFilePath: "/myFolder1/abcd.png", file: Blob(~~~~~);
    // 해당 경로에 파일 생성 및 업로드. 경로에 폴더가 없으면 폴더 같이 생성
    // 업로드 다운로드시 유저 로그인 체크하고 확인되면 진행.
    res.send('respond with a resource3');
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});
router.put('/file/:fileId', async (req, res, next) => {
  try {
    // 인자값으로 경로 및 파일명을 받아서
    // 파일을 이동하거나 이름 변경
    res.send('respond with a resource4');
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});
router.delete('/file/:fileId', async (req, res, next) => {
  try {
    // 인자값으로 경로 및 파일명을 받아서
    // 해당 파일을 삭제시킴
    res.send('respond with a resource5');
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});

////////////////////////////// 
// 파일공유
//////////////////////////////
router.post('/shareFile', async (req, res, next) => {
  try {
    // 인자값으로 경로 및 파일명을 받아서(urlEncode 필수)
    // 혹은 userFilePath: "/myFolder1/abcd.png", file: Blob(~~~~~), period:~~까지
    // 해당 파일을 공유하기 위한 링크 생성.
    // DB에 누가 공유했는지, 언제까지인지 정보 생성
    // 업로드 다운로드시 유저 로그인 체크하고 확인되면 진행.
    // 임시경로 생성 시 존재여부 확인 이후 진행
    res.send('respond with a resource3');
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});
router.get('/shareFile/:fileId', async (req, res, next) => {
  try {
    // 인자값으로 생성된 문자열을 통해서 임시파일 다운로드
    // DB에 문자열을 읽어와서 해당 경로의 파일 전송
    res.send('respond with a resource3');
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});
router.put('/shareFile/:fileId', async (req, res, next) => {
  try {
    // 인자값으로 생성된 문자열을 통해서 임시파일 기간 수정
    // jwt 등 로그인된 정보를 기반하여 수정여부 결정
    res.send('respond with a resource3');
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});
router.delete('/shareFile/:fileId', async (req, res, next) => {
  try {
    // 인자값으로 생성된 문자열을 통해서 임시파일 공유 취소
    // 실제 파일 및 임시경로는 삭제하지 않으나, 사용할 수 없게 사용여부 N으로 설정
    res.send('respond with a resource3');
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;