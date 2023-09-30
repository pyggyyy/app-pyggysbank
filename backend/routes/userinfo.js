// routes/userinfo.js
const express = require('express');
const router = express.Router();
const userInfoController = require('../controllers/userinfo');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

// Define your routes for UserInfo here, including create, read, update, and delete operations.
// Example routes:
router.post('/', checkAuth, extractFile, userInfoController.createUserInfo);
//router.get('/:id', userInfoController.getUserInfo);
//router.put('/:id', userInfoController.updateUserInfo);


module.exports = router;
