const express = require('express');

const PlayController = require('../controllers/plays');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();



router.post('', checkAuth, extractFile ,PlayController.createPlay);

//router.put('/:id', checkAuth, extractFile, PlayController.editPlay);

router.get('', PlayController.getPlays);

//router.get('/:sid', PlayController.getPlay)

router.delete('/:id', checkAuth, PlayController.deletePlay);

module.exports = router;