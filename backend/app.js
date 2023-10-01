const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

const todoRoutes = require('./routes/todos');
const userRoutes = require('./routes/user');
const userInfoRoutes = require('./routes/userinfo');
const playRoutes = require('./routes/plays');

const app = express();

//Get from Mongo Instance Connect Modal




mongoose.connect(process.env.MONGO_ATLAS_DB)
.then(() => {
    console.log('Connected to DB');
})
.catch(() => {
    console.log('Connection Failed');
})

app.use(bodyParser.json());
app.unsubscribe(bodyParser.urlencoded({extended:false}));
app.use('/images',express.static(path.join('images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE, PUT, OPTIONS');
    next();
})

app.use('/api/todos',todoRoutes);
app.use('/api/user',userRoutes);
app.use('/api/userinfo',userInfoRoutes);
app.use('/api/plays',playRoutes);

module.exports = app;