const UserInfo = require('../models/userinfo');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');

const bucketName = process.env.BUCKET_NAME;
const regionName = process.env.BUCKET_REGION;
const accessKey= process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const publicBucket = process.env.PUBLIC_BUCKET;

const s3 = new S3Client({
  // AWS S3 configuration (accessKeyId, secretAccessKey, region)
  credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey
    },
    region: regionName
});

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg':'jpg'
}

exports.createUserInfo = (req,res,next) => {
    const url = req.protocol + '://' + req.get('host');
    const userinfo = new UserInfo({
        username: req.body.username,
        bio: req.body.bio,
        profilePic: null,
        creator:req.userData.userId,
        net: 0
    });
    console.log(userinfo);
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
        userinfo.profilePic = publicBucket + filename;
    }
    userinfo.save().then(createdUserInfo => {
        console.log(createdUserInfo);
        res.status(201).json({
            message: 'UserInfo Added Succesfully',
            userinfo: {
                ...createdUserInfo,
                id: createdUserInfo._id,
            }
        });
    })
    .catch(error => {
        res.status(500).json({
            message: 'Creating UserInfo Failed'
        })
    })
}

exports.editUserInfo = (req,res,next) => {
    let imagePath = req.body.profilePic;
    console.log(imagePath);
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
    console.log(req.body.id);
    console.log(req.userData.userId);
    const userinfo = new UserInfo({
        _id: req.body.id,
        username: req.body.username,
        bio: req.body.bio,
        profilePic: imagePath,
        creator: req.userData.userId,
        net: req.body.net,
    })
    console.log('working');
    console.log(userinfo);
    UserInfo.updateOne({_id:req.body.id, creator:req.userData.userId},userinfo).then(result => {
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
        console.log(error);
        res.status(500).json({
            message: "Couldn't Update Todo"
        })
    })
}


exports.getUserInfo = (req, res, next) => {
  UserInfo.findOne({ creator: req.params.id })
    .then((userInfo) => {
      if (userInfo) {
        res.status(200).json(userInfo);
      } else {
        res.status(404).json({ message: 'User Info Not Found' });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't Get User Info",
      });
    });
};



