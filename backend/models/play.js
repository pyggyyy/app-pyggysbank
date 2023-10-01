const mongoose = require('mongoose');

const playSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: false },
    imagePath: { type: String, required: false },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    stake: { type: Number, required: true },
    payout: { type: Number, required: true },
    graded: { type: Boolean, required: true },
    ifWin: { type: Boolean, required: true }
});

module.exports = mongoose.model('Play', playSchema);