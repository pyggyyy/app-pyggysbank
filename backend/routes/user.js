const express = require('express');

//import controllers
const UserController = require('../controllers/users');


const router = express.Router();

router.post('/signup', UserController.createUser);

router.post('/login', UserController.userLogin);

module.exports = router;