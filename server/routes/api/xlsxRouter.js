const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsxController = require('../../controllers/xlsxController');

const upload = multer({ dest: 'uploads/' });

router.route('/')
.post(upload.single('xlsxfile'),xlsxController.handleQuestionBank);

module.exports = router;