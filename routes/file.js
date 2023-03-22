const router = require('express').Router();
const fileService = require('../service/fileService');

router.post('/upload', async (req, res, next) => {
  try {
    if (!req.files) {
      return res.status(400).json({ message: 'No files were uploaded' });
    }
    // 파일 업로드 처리
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
    const filesInfo = await fileService.upload(files);
    res.send({fileIds: filesInfo.map(e => e._id.toString())});
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});
router.get('/download/:_id', async (req, res, next) => {
  try {
    const { _id } = req.params;
    const fileData = await fileService.getFileData(_id)
    res.download(fileData.filePath, fileData.fileName);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
router.get('/downloadTest', async (req, res, next) => {
  try {
    const fileImpl = require('../service/impl/fileServiceImpl')
    let data = await fileImpl.findAll()
    res.send(data)
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;