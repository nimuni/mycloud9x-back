const router = require('express').Router();
const fileService = require('../service/fileService');

router.post('/upload', async (req, res, next) => {
  if (!req.files) {
    return res.status(400).json({ message: 'No files were uploaded' });
  }
  try {
    const fileIds = await fileService.upload(req.files.files);
    res.send(fileIds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get('/download/:_id', async (req, res, next) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid file ID' });
  }

  File.findById(id)
    .then(file => {
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }

      const filepath = path.join(__dirname, 'uploads', file.name);

      res.download(filepath, file.name, err => {
        if (err) {
          res.status(500).json({ message: err.message });
        }
      });
    })
    .catch(err => res.status(500).json({ message: err.message }));
});

module.exports = router;