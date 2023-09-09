const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const Todo = require('./models/todo');

const app = express();

//Get from Mongo Instance Connect Modal
mongoose.connect("mongodb+srv://admin:AIuglc4HpcRO8mIp@pyggysbank.hjupg.mongodb.net/node-angular?retryWrites=true&w=majority")
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
    todo.save();
    res.status(201).json({
        message: 'Post Added Succesfully'
    });
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

module.exports = app;