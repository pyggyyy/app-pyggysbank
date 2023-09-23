const Todo = require('../models/todo');


//Routes Here
exports.createTodo = (req,res,next) => {
    const url = req.protocol + '://' + req.get('host');
    const todo = new Todo({
        title: req.body.title,
        content: req.body.content,
        imagePath: null,
        creator:req.userData.userId
    });
    if(req.file){
        todo.imagePath = url + '/images/' + req.file.filename;
    }
    todo.save().then(createdTodo => {
        res.status(201).json({
            message: 'Todo Added Succesfully',
            todo: {
                ...createdTodo,
                id: createdTodo._id,
            }
        });
    })
    .catch(error => {
        res.status(500).json({
            message: 'Creating Todo Failed'
        })
    })
}

exports.editTodo = (req,res,next) => {
    let imagePath = req.body.imagePath;
    if(req.file){
        const url = req.protocol + '://' + req.get('host');
        imagePath = url  + '/images/' + req.file.filename;
    }
    const todo = new Todo({
        _id: req.body.id,
        title:req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    })
    console.log(todo);
    Todo.updateOne({_id:req.params.id, creator:req.userData.userId},todo).then(result => {
        console.log(result);
        if(result.modifiedCount > 0){
            res.status(200).json({
                message: 'Update Succesful'
            })
        } else{
            res.status(401).json({
                message: 'Not Authorized'
            })
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Couldn't Update Todo"
        })
    })
}


exports.getTodos = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const todoQuery = Todo.find()
    .sort({ _id: -1 }); // Sort by '_id' in descending order (newest first)
    let fetchedTodos;
    if(pageSize && currentPage){
        todoQuery.skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    todoQuery.then(documents => {
        fetchedTodos = documents;
        return Todo.count();
    })
    .then(count => {
        res.status(200).json({
            message:'Todos Fetched Succesfully!',
            todos:fetchedTodos,
            maxTodos: count
        })
    })
    .catch(error => {
        res.status(500).json({
            message: "Couldn't Get Todos"
        })
    });
}

exports.getTodo = (req,res,next) => {
    Todo.findById(req.params.id).then(todo => {
        if(todo){
            res.status(200).json(todo);
        }
        else{
            res.status(404).json({message: 'Todo Not Found'});
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Couldn't Get Todo"
        })
    })
}


exports.deleteTodo = (req,res,next) => {
    Todo.deleteOne({_id:req.params.id, creator: req.userData.userId}).then(result => {
        console.log(result);
        if(result.deletedCount > 0){
            res.status(200).json({
                message: 'Deletion Succesful'
            })
        } else{
            res.status(401).json({
                message: 'Not Authorized'
            })
        }
    }).catch(error => {
        res.status(500).json({
            message: "Deleting Todo Failed"
        })
    })
}