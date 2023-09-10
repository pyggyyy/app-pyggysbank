const express = require('express');

const Todo = require('../models/todo');

const router = express.Router();

router.post('', (req,res,next) => {
    //To be Replaced with Establishing DB Entry
    const todo = new Todo({
        title: req.body.title,
        content: req.body.content
    });
    todo.save().then(createdTodo => {
        res.status(201).json({
            message: 'Todo Added Succesfully',
            todoId: createdTodo._id
        });
    });
})

router.put('/:id', (req,res,next) => {
    const todo = new Todo({
        _id: req.body.id,
        title:req.body.title,
        content: req.body.content
    })
    Todo.updateOne({_id:req.params.id},todo).then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Update Succesful'
        })
    })
})

router.get('',(req, res, next) => {
    //To be Repolaced with Data from DB
    Todo.find().then(documents => {
        res.status(200).json({
            message: 'Recieved Succesfully',
            todos: documents
        });
    })
});

//Get 1 Todo
router.get('/:id',(req,res,next) => {
    Todo.findById(req.params.id).then(todo => {
        if(todo){
            res.status(200).json(todo);
        }
        else{
            res.status(404).json({message: 'Todo Not Found'});
        }
    })
})

router.delete('/:id', (req,res,next) => {
    Todo.deleteOne({_id:req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({message: 'Todo Deleted'});
    })
})

module.exports = router;