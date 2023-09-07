const express = require('express');

const app = express();

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