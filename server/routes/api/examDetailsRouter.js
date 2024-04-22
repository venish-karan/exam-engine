const express = require('express');
const router = express.Router();
const examDetailsController = require('../../controllers/examDetailsController');

router.route('/')
.get(examDetailsController.handleExamDetails);

module.exports = router;