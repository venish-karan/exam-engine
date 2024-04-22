const express = require('express');
const router = express.Router();
const examCompletedController = require('../../controllers/examCompletedController');

router.route('/')
.post(examCompletedController.handleExamCompleted);

module.exports = router;