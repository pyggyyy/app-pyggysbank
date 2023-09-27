const Todo = require('../models/todo');

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const bucketName = process.env.BUCKET_NAME;
const regionName = process.env.BUCKET_REGION;
const accessKey= process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const publicBucket = process.env.PUBLIC_BUCKET;

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: regionName
})


const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg':'jpg'
}

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
        if(!MIME_TYPE_MAP[req.file.mimetype]){
            res.status(500).json({
                message: 'Invalid File Type'
            })
            
        }
        let filename = req.file.originalname.toLocaleLowerCase().split(' ').join('-') + '-' + Date.now() + '.' + MIME_TYPE_MAP[req.file.mimetype];

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key:filename,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        })

        s3.send(command);
        todo.imagePath = publicBucket + filename;
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
        if(!MIME_TYPE_MAP[req.file.mimetype]){
            res.status(500).json({
                message: 'Invalid File Type'
            })
            
        }
        let filename = req.file.originalname.toLocaleLowerCase().split(' ').join('-') + '-' + Date.now() + '.' + MIME_TYPE_MAP[req.file.mimetype];

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key:filename,
            Body: req.file.buffer,
            ContentType: req.file.mimetype
        })

        s3.send(command);
        imagePath = publicBucket + filename;
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
        if(result.matchedCount > 0){
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