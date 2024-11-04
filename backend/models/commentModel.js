const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
}, { timestamps: true }); // Agregar timestamps para saber cuándo fue creado y actualizado

const CommentModel = mongoose.model('Comment', commentSchema);

module.exports = CommentModel;
