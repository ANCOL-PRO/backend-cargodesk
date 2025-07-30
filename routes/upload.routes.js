const express = require('express');
const multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('archivo'), (req, res) => {
  res.json({ message: 'Archivo subido con éxito', file: req.file });
});

module.exports = router;
