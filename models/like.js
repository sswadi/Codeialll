const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId
    },

    //this defines the object id of the liked object ie if the like was made on comment or post
    likeable: {
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'onModel'
    },

    onModel: {
        type: String,
        required: true,
        enum: ['Post', 'Comment']
    }

}, {
    timestamps: true
});


const Like = mongoose.model('Like', likeSchema);

module.exports = Like;