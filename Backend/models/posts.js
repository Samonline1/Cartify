const mongoose = require('mongoose');

// cart item
const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }, 
    productId: {
        type: Number, // because dummyjson uses number IDs
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("posts", postSchema);
