const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: false}
})

module.exports = mongoose.model('Todo', todoSchema);
