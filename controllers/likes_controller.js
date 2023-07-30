
const Comment = require('../models/comment');
const Post = require('../models/post');
const Like = require('../models/like');

module.exports.toggleLike = async function(req, res){

    try{

        // likes/toggle/?id=abcdef&type=Post
        let likeable;
        let deleted = false;

        if(req.query.type == 'Post'){ //determining if the like has been made on a post or a comment
            likeable = await Post.findById(req.query.id).populate('likes'); 
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        //check if a like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        })

        //if like already exists then delete it
        if(existingLike){
            likeable.likes.pull(existingLike._id); //  pulling out from Post/Comments schema
            await likeable.save();
            await existingLike.deleteOne(); //also deleting it from the Like schema
            deleted = true;

        }else{
            //else make a new like
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type,
            });

            likeable.likes.push(newLike._id);
            likeable.save();
        }

        // return res.status(200).json({
        //     message: 'Request Successful!',
        //     data: {
        //         deleted: deleted
        //     }
        // });
        res.redirect('back');

    }
    catch(err){

        // return res.status(500).json({
        //     message: 'Internal Server Error',
        // });

        console.log("error in likes_controller", +err.message);

    }
}