const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
    title: { type: String, required: true }, // The name of the tag
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // You can add more fields to the Tag model as needed
});

module.exports = mongoose.model('Tag', tagSchema);