const Play = require('../models/play');

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
exports.createPlay = (req,res,next) => {
    const url = req.protocol + '://' + req.get('host');
    const play = new Play({
        title: req.body.title,
        content: req.body.content,
        imagePath: null,
        creator:req.userData.userId,
        stake: req.body.stake,
        payout: req.body.payout,
        ifWin: false,
        graded:false
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
            ContentType: req.file.mimetype,
            CacheControl: 'no-cache', // Set the Cache-Control header
        })

        s3.send(command);
        play.imagePath = publicBucket + filename;
    }
    play.save().then(createdPlay => {
        res.status(201).json({
            message: 'Play Added Succesfully',
            play: {
                ...createdPlay,
                id: createdPlay._id,
            }
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            message: 'Creating Play Failed'
        })
    })
}

/*exports.editPlay = (req,res,next) => {
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
            ContentType: req.file.mimetype,
            CacheControl: 'no-cache', // Set the Cache-Control header
        })

        s3.send(command);
        imagePath = publicBucket + filename;
    }
    const play = new Play({
        _id: req.body.id,
        title:req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    })
    console.log(play);
    Play.updateOne({_id:req.params.id, creator:req.userData.userId},play).then(result => {
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
            message: "Couldn't Update Play"
        })
    })
}*/


exports.getPlays = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    
    // Sort by 'graded' in ascending order (false first), then by '_id' in descending order (newest first)
    const playQuery = Play.find()
      .sort({ graded: 1, _id: -1 });
  
    let fetchedPlays;
    
    if (pageSize && currentPage) {
      playQuery
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
    }
    
    playQuery
    .then(documents => {
    fetchedPlays = documents;
    return Play.count();
    })
    .then(count => {
    res.status(200).json({
        message: 'Plays Fetched Successfully!',
        plays: fetchedPlays,
        maxPlays: count
    });
    })
    .catch(error => {
    res.status(500).json({
        message: "Couldn't Get Plays"
    });
    });
}
  

/*exports.getPlay = (req,res,next) => {
    Play.findById(req.params.id).then(play => {
        if(play){
            res.status(200).json(play);
        }
        else{
            res.status(404).json({message: 'Play Not Found'});
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Couldn't Get Play"
        })
    })
}*/

exports.updatePlay = (req,res,next) => {
    const playId = req.body.id;
    const update = {
        graded: req.body.graded,
        ifWin: req.body.ifWin,
    };

    Play.updateOne(
        { _id: playId, creator: req.userData.userId }, // Match the play by ID and user ID
        update
    )
    .then((result) => {
        if (result.matchedCount > 0) {
        res.status(200).json({
            message: 'Update Successful',
        });
        } else {
        res.status(401).json({
            message: 'Not Authorized to Update',
        });
        }
    })
    .catch((error) => {
        res.status(500).json({
        message: "Couldn't Update Play",
        });
    });
}


exports.deletePlay = (req,res,next) => {
    Play.deleteOne({_id:req.params.id, creator: req.userData.userId}).then(result => {
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
            message: "Deleting Play Failed"
        })
    })
}