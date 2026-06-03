const express = require('express');
const router = express.Router();
const controller = require('../controllers/rag.controller');

router.post('/upload', controller.upload);
router.post('/query', controller.query);

module.exports = router;
