const Tag = require('../models/tag');

// Create a new tag
exports.createTag = (req, res, next) => {
    console.log(req.query.title);
    console.log(req.userData.userId);
    const tag = new Tag({
        title: req.query.title,
        creator: req.userData.userId, // Associate the tag with the logged-in user
    });

    tag.save().then(createdTag => {
        res.status(201).json({
            message: 'Tag Created Successfully',
            tag: {
                ...createdTag,
                id: createdTag._id,
            },
        });
    })
    .catch(error => {
        res.status(500).json({
            message: 'Creating Tag Failed',
        });
    });
};

// Get tags associated with a user (filtered by userIdString)
exports.getTags = (req, res, next) => {
    const userIdString = req.query.userIdString;

    // Query tags associated with the specified user
    Tag.find({ creator: userIdString })
        .then(tags => {
            res.status(200).json({
                message: 'Tags Fetched Successfully!',
                tags: tags,
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Couldn't Get Tags",
            });
        });
};