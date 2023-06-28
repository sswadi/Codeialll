const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');

//mutlter setup; it is done here and not config folder(this can also be created- a centralised thingy) as we are uplaodng DP for user and it is user specific 
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email: {
        type:  String,
        required: true,
        unique: true
    },

    password: {
        type:  String,
        required: true
    },

    name: {
        type:  String,
        required: true
    },
    avatar: {
        type: String,
        
    }

}, {
    timestamps: true
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', AVATAR_PATH ));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

//static methods
// In the context of a Mongoose schema, the statics object is used to define static methods that can be called on the model itself.
// Static methods are not tied to specific instances of the model, but rather operate on the model level.
userSchema.statics.uploadedAvatar = multer({ storage: storage }).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model('User', userSchema);

module.exports = User;