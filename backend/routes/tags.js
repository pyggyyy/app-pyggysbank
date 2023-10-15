const express = require('express');

const TagController = require('../controllers/tags');

const checkAuth = require('../middleware/check-auth');


const router = express.Router();

router.post('', checkAuth, TagController.createTag);
router.get('', checkAuth, TagController.getTags);

module.exports = router;