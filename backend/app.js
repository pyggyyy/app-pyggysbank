const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const todoRoutes = require('./routes/todos');

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
app.use('/images',express.static(path.join('backend/images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE, PUT, OPTIONS');
    next();
})

app.use('/api/todos',todoRoutes);

module.exports = app;