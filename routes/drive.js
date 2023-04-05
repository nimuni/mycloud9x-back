const router = require('express').Router();
const fileService = require('../service/fileService');
const driveRootService = require('../service/driveRootService');
const driveFileService = require('../service/driveFileService');
const driveFolderService = require('../service/driveFolderService');
const { verifyJwt } = require('../js/jwt');
const { fileNameFilter } = require('../js/common.util');

//////////////////////////////
// 관리자 폴더 작업
//////////////////////////////
// 설정할 폴더 위치 조회(서버 내 폴더 및 파일목록 조회)
router.get('/root/serverFolderPath/:path', verifyJwt, async (req, res, next) => {
  try {
    console.log("call /root/serverFolderPath/:path")
    const path = req.params.path == ":path" ? undefined : req.params.path;
    console.log(path)
    const result = await driveRootService.getServerPath(path);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
router.get('/root/driveInfo/:path', verifyJwt, async (req, res, next) => {
  try {
    console.log("call /root/driveInfo/:path")
    const path = req.params.path == ":path" ? undefined : req.params.path;
    console.log(path)
    const result = await driveRootService.getDriveInfo(path);
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
router.post('/root/makeFolder/:path', verifyJwt, async (req, res, next) => {
  try {
    console.log("call /root/makeFolder/:path")
    const path = req.params.path == ":path" ? undefined : req.params.path;
    console.log(path)
    await driveRootService.mkdir(path);
    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
// 설정된 루트 폴더들 정보 조회 - 사용용량, 총용량, 이름, 위치
router.get('/root/allRootFolder', verifyJwt, async (req, res, next) => {
  try {
    const driveRoots = await driveRootService.getAllDriveRoot()
    res.send(driveRoots);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
router.get('/root/driveRoot/:_id', verifyJwt, async (req, res, next) => {
  try {
    const driveRoot = await driveRootService.getDriveRoot(req.params._id)
    res.send(driveRoot);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
// 루트 폴더 총 용량, 사용량, 별명, 폴더위치 입력
router.post('/root/driveRoot', verifyJwt, async (req, res, next) => {
  try {
    const driveRootObj = {
      name: req.body.name,
      path: req.body.path,
      maximumSize: req.body.maximumSize
    }
    const driveRoot = await driveRootService.insertDriveRoot(driveRootObj)
    res.send(driveRoot);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
// 루트 폴더 총 용량, 별명, 폴더위치 수정
router.put('/root/driveRoot/:_id', verifyJwt, async (req, res, next) => {
  try {
    const changeObj = {
      name: req.body.name,
      path: req.body.path,
      maximumSize: req.body.maximumSize
    }

    const driveRoot = await driveRootService.updateDriveRoot(req.params._id, changeObj)
    res.send(driveRoot);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
// 루트 폴더 삭제(내부에 파일이 없을때에만)
router.delete('/root/driveRoot/:_id', verifyJwt, async (req, res, next) => {
  try {
    const driveRoot = await driveRootService.deleteDriveRoot(req.params._id)
    res.send(driveRoot);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});


//////////////////////////////
// 폴더 처리
//////////////////////////////
// 폴더의 상대경로를 얻어옴
router.get('/folder/relativePath/:_id', verifyJwt, async (req, res, next) => {
  try {
    const pipelineResult = await driveFolderService.getRelativePath(req.params._id, req.user._id);
    res.send(pipelineResult);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
// 현재 폴더의 자식폴더ID를 얻어옴
router.get('/folder/childFolders/:_id', verifyJwt, async (req, res, next) => {
  try {
    let childFolderIds = [];
    // childFolderIds.push(req.params._id) // 현재 폴더 ID 추가
    let foundFolderIds = await driveFolderService.childFolders(req.params._id, req.user._id);
    childFolderIds.push(...foundFolderIds);
    res.send(childFolderIds);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
// 현재 폴더의 자식폴더ID를 얻어옴
router.get('/folder/descendantFolderIds/:_id', verifyJwt, async (req, res, next) => {
  try {
    let childFolderIds = [];
    // childFolderIds.push(req.params._id) // 현재 폴더 ID 추가
    let foundFolderIds = await driveFolderService.getDescendantFolderIds(req.params._id, req.user._id);
    childFolderIds.push(...foundFolderIds);
    res.send(childFolderIds);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
// 현재 폴더의 정보를 얻어옴
router.get('/folder/info/:_id', verifyJwt, async (req, res, next) => {
  try {
    const findObj = {
      _id: req.params._id,
      owner: req.user._id,
    };
    const folder = await driveFolderService.readDirInfo(findObj);
    res.send(folder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
// 부모폴더ID를 기반으로 해당 폴더안의 폴더와 파일들을 얻어옴
router.get('/folder/content/:parentFolderId', verifyJwt, async (req, res, next) => {
  try {
    const { parentFolderId } = req.params;
    let tempParentFolderId = parentFolderId == 'root' ? 'root' : parentFolderId;
    const findObj = {
      parentFolderId: tempParentFolderId,
      owner: req.user._id,
    };
    const filesAndFolders = await driveFolderService.readDir(findObj);
    res.send(filesAndFolders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
// 전송한 정보로 폴더 생성
router.post('/folder', verifyJwt, async (req, res, next) => {
  try {
    const { name, parentFolderId } = req.body;
    const tempParentFolderId = parentFolderId == 'root' ? 'root' : parentFolderId;
    const owner = req.user._id;

    if (parentFolderId == 'root') res.status(500).json({ message: 'parentFolderId can not be root' });

    const folder = await driveFolderService.mkdir(fileNameFilter(name), tempParentFolderId, owner);
    res.send(folder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
// 폴더정보 변경 (이름변경, 위치이동)
router.put('/folder/:_id', verifyJwt, async (req, res, next) => {
  try {
    const { name, parentFolderId } = req.body;
    let changeFolderObj = {};
    if (name) changeFolderObj.name = fileNameFilter(name);
    if (parentFolderId) changeFolderObj.parentFolderId = parentFolderId;

    const folder = await driveFolderService.modifyDir(req.params._id, changeFolderObj);
    res.send(folder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
// 폴더 공유자권한 추가
router.put('/folder/grantPermission/:folderId', verifyJwt, async (req, res, next) => {
  try {
    console.log("call /folder/grantPermission/:folderId")
    const { userId, role, dateString } = req.body;
    let result = new Date(dateString)
    console.log(result)
    const permissionObj = {
      userId: userId,
      role: role,
      endDate: new Date(dateString),
    };
    console.log(permissionObj)
    console.log(req.user)

    // TODO. 임시로 기존권한 삭제 후 부여. upsert기능 찾아봐야함. 현재 중복으로 입력되는 문제가 있음
    const modifiedFolderRevoke = await driveFolderService.revokePermission(req.params.folderId, permissionObj, req.user._id);
    const modifiedFolder = await driveFolderService.grantPermission(req.params.folderId, permissionObj, req.user._id);
    res.send(modifiedFolder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
// 폴더 공유자권한 제거
router.put('/folder/revokePermission/:folderId', verifyJwt, async (req, res, next) => {
  try {
    const { userId, role } = req.body;

    const permissionObj = {
      userId: userId,
      role: role,
    };

    const modifiedFolder = await driveFolderService.revokePermission(req.params.folderId, permissionObj, req.user._id);
    res.send(modifiedFolder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
// 해당 폴더 삭제.
router.delete('/folder/:_id', verifyJwt, async (req, res, next) => {
  try {
    // 전송된 폴더경로 및 폴더명으로 폴더 삭제.
    // 삭제시 하위파일 존재하면 하위파일까지 전부 날려야함.
    console.log("call delete /folder/:_id")
    let folderIds = [];
    const owner = req.user._id;
    const currentFolderInfo = await driveFolderService.readDirInfo({ _id: req.params._id });
    if (currentFolderInfo.parentFolderId != 'root') folderIds.push(req.params._id);
    const childFolderIds = await driveFolderService.getDescendantFolderIds(req.params._id, owner);
    folderIds.push(...childFolderIds);

    // 해당 폴더IDs를 상위로 가지고있는 파일 및 폴더 삭제
    const deleteFileResult = await driveFileService.deleteManyFromFolderIds(folderIds, owner);
    const deleteFolderResult = await driveFolderService.deleteMany(folderIds, owner);
    let deleteResult = deleteFileResult + deleteFolderResult;

    // 현재폴더 삭제
    const removeFolder = await driveFolderService.removeDir({ _id: req.params._id })
    if (removeFolder) {
      res.status(204).send(removeFolder);
    } else {
      res.status(400).send();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// TODO. 파일처리부분 진행해야함
//////////////////////////////
// 파일처리
//////////////////////////////
// 해당 폴더ID를 부모로가지게 파일들 업로드
router.post('/uploadFiles/:folderId', verifyJwt, async (req, res, next) => {
  try {
    console.log("call post /uploadFiles/:folderId")
    if (!req.files) {
      return res.status(400).json({ message: 'No files were uploaded' });
    }
    // 파일 업로드 처리
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    // 업로드 다운로드시 유저 로그인 체크하고 확인되면 진행.
    const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
    console.log("files")
    console.log(files)
    const uploadedFileInfoArray = await driveFileService.uploadDriveFiles(req.params.folderId, files, req.user._id);

    res.send(`${uploadedFileInfoArray.length} uploaded success`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
// driveFile의 id를 기반으로, 해당 파일의 정보 조회
router.get('/file/:fileId', verifyJwt, async (req, res, next) => {
  try {
    // 해당 경로의 파일 정보를 리턴
    const foundFile = await driveFileService.findOne(req.params.fileId, req.user._id);
    res.send(foundFile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
// driveFile의 id를 기반으로, 파일명 변경, 파일 이동
router.put('/file/:fileId', verifyJwt, async (req, res, next) => {
  try {
    // 파일을 이동하거나 이름 변경만 가능
    const { name, parentFolderId } = req.body;

    const changeFileInfoObj = {};
    if (name) changeFileInfoObj.name = req.body.name;
    if (parentFolderId) changeFileInfoObj.parentFolderId = req.body.parentFolderId;

    const modifiedFile = await driveFileService.update(req.params.fileId, changeFileInfoObj, req.user._id);
    res.send(modifiedFile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
// driveFile의 id를 기반으로 공유자 권한 추가
router.put('/file/grantPermission/:fileId', verifyJwt, async (req, res, next) => {
  try {
    const { userId, role, dateString } = req.body;

    const permissionObj = {
      userId: userId,
      role: role,
      endDate: new Date(dateString),
    };

    const modifiedFile = await driveFileService.grantPermission(req.params.fileId, permissionObj, req.user._id);
    res.send(modifiedFile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
// driveFile의 id를 기반으로 공유자 권한 제거
router.put('/file/revokePermission/:fileId', verifyJwt, async (req, res, next) => {
  try {
    const { userId, role, dateString } = req.body;

    const permissionObj = {
      userId: userId,
      role: role,
      endDate: new Date(dateString),
    };

    const modifiedFile = await driveFileService.revokePermission(req.params.fileId, permissionObj, req.user._id);
    res.send(modifiedFile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
// driveFile의 id를 기반으로 파일 삭제
router.delete('/file/fileId/:fileId', verifyJwt, async (req, res, next) => {
  try {
    // 파일 ID를 받아서 해당 파일을 삭제시킴
    const deletedFile = await driveFileService.delete(req.params.fileId, req.user._id);
    res.send(deletedFile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
router.delete('/file/folderIds', verifyJwt, async (req, res, next) => {
  try {
    // 파일 ID를 받아서 해당 파일을 삭제시킴
    const deletedFile = await driveFileService.delete(req.params.fileId, req.user._id);
    res.send(deletedFile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// TODO
// 파일 공유링크 생성.
// 공유링크 생성 시, 해당 URL을 통해서 파일접근이 가능하도록.
// 조회시
//////////////////////////////
// 파일공유
//////////////////////////////
router.post('/shareFile/:fildId', verifyJwt, async (req, res, next) => {
  try {
    // 파일 및 사용자 정보를 받아서
    // req.params.fildId
    // req.body.role
    // req.body.userId

    // 파일에 공유정보를 입력한다.

    // 단일 파일만 볼 수 있는 drive. 리턴 시 파일 조회부분만 표시
    res.send('respond with a resource3');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
router.get('/shareFile/:fileId', verifyJwt, async (req, res, next) => {
  try {
    // 인자값으로 생성된 문자열을 통해서 임시파일 다운로드
    // DB에 문자열을 읽어와서 해당 경로의 파일 전송
    res.send('respond with a resource3');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
router.put('/shareFile/:fileId', verifyJwt, async (req, res, next) => {
  try {
    // 인자값으로 생성된 문자열을 통해서 임시파일 기간 수정
    // jwt 등 로그인된 정보를 기반하여 수정여부 결정
    res.send('respond with a resource3');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});
router.delete('/shareFile/:fileId', verifyJwt, async (req, res, next) => {
  try {
    // 인자값으로 생성된 문자열을 통해서 임시파일 공유 취소
    // 실제 파일 및 임시경로는 삭제하지 않으나, 사용할 수 없게 사용여부 N으로 설정
    res.send('respond with a resource3');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
