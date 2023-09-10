const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const Todo = require('./models/todo');

const app = express();

//Get from Mongo Instance Connect Modal
const fs = require('fs');

// Read the content of the file synchronously (you can also use async methods)
const credentialsFilePath = './credentials.txt';
const credentials = fs.readFileSync(credentialsFilePath, 'utf8').trim();


mongoose.connect(credentials)
.then(() => {
    console.log('Connected to DB');
})
.catch(() => {
    console.log('Connection Failed');
})

app.use(bodyParser.json());
app.unsubscribe(bodyParser.urlencoded({extended:false}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE, PUT, OPTIONS');
    next();
})

app.post('/api/todos', (req,res,next) => {
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

app.put('/api/todos/:id', (req,res,next) => {
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

app.get('/api/todos',(req, res, next) => {
    //To be Repolaced with Data from DB
    Todo.find().then(documents => {
        res.status(200).json({
            message: 'Recieved Succesfully',
            todos: documents
        });
    })
});

//Get 1 Todo
app.get('/api/todos/:id',(req,res,next) => {
    Todo.findById(req.params.id).then(todo => {
        if(todo){
            res.status(200).json(todo);
        }
        else{
            res.status(404).json({message: 'Todo Not Found'});
        }
    })
})

app.delete('/api/todos/:id', (req,res,next) => {
    Todo.deleteOne({_id:req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({message: 'Todo Deleted'});
    })
})

module.exports = app;