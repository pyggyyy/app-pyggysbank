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
        userinfo.profilePic = publicBucket + filename;
    }
    userinfo.save().then(createdUserInfo => {
        res.status(201).json({
            message: 'UserInfo Added Succesfully',
            userinfo: {
                ...userinfo,
                id: userinfo._id,
            }
        });
    })
    .catch(error => {
        res.status(500).json({
            message: 'Creating UserInfo Failed'
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

exports.updateUserInfo = (req, res, next) => {
  const { id, username, bio } = req.body;
  const profilePic = req.file ? req.file : null;

  UserInfo.findOne({ creator: id })
    .then((userInfo) => {
      if (!userInfo) {
        return res.status(404).json({ message: 'User Info Not Found' });
      }

      // Update user info fields
      userInfo.username = username;
      userInfo.bio = bio;
      userInfo.creator = req.userData.userId

      // Check if a new profile picture is provided
      if (profilePic) {
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
        userInfo.imagePath = publicBucket + filename;
      }

      return userInfo.save();
    })
    .then((updatedUserInfo) => {
      res.status(200).json({
        message: 'User Info Updated Successfully',
        userInfo: updatedUserInfo,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't Update User Info",
      });
    });
};


