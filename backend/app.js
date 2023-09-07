const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.unsubscribe(bodyParser.urlencoded({extended:false}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers','Origin,X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods','GET, POST. PATCH, DELETE, PUT, OPTIONS');
    next();
})

app.post('api/todos', (req,res,next) => {
    const todos = req.body;
    console.log(todos);
    res.status(201).json({
        message: 'Post Added Succesfully'
    });
})

app.use('/api/todos',(req, res, next) => {
    const todos = [
        {
            id:'asdf234',
            title:'First Todo',
            content: 'coming from server'
        },
        {
            id:'tyrej345',
            title:'Second Todo',
            content: 'coming from server again!'
        }
    ]
    res.status(200).json({
        message: 'Recieved Succesfully',
        todos: todos
    });
});

module.exports = app;