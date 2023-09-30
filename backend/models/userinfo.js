// models/userinfo.js
const mongoose = require('mongoose');

const userInfoSchema = mongoose.Schema({
    username: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    profilePic: { type: String }, // Store the S3 URL for the profile picture
    bio: { type: String }
});

module.exports = mongoose.model('UserInfo', userInfoSchema);