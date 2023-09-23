const express = require('express');

const TodoController = require('../controllers/todos');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();



router.post('', checkAuth, extractFile ,TodoController.createTodo);

router.put('/:id', checkAuth, extractFile, TodoController.editTodo);

router.get('', TodoController.getTodos);

router.get('/:id', TodoController.getTodo)

router.delete('/:id', checkAuth, TodoController.deleteTodo);

module.exports = router;