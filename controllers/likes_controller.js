const Like = require('../models/like');
const Comment = require('../models/comment');
const Post = require('../models/post');


module.exports.toggleLike = async function(req, res){
    try{

        // likes/toggle/?id=abcdef&type=Post

        let likeable;
        let deleted = false;

        if(req.query.type == 'Post'){ //determining if the like has been made on a post or a comment
            likeable = Post.findById(req.query.id).populate('likes'); 


        }else{
            likeable = Comment.findById(req.query.id).populate('likes');
        }

        //check if a like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        })

        //if like already exists then delete it
        if(existingLike){
            likeable.likes.pull(existingLike._id); //pulling out from Post/Comments schema
            likeable.save();

            existingLike.remove(); //also deleting it from the Like schema
            deleted = true;

        }else{
            //else make a new like
            let newLike = await Like.create({
                likeable: req.query.id,
                onModel: req.query.type,
                user: req.user._id
            });

            likeable.likes.ush(newLike._id);
            likeable.save();

        }

        return res.json(200, {
            message: "Request Successful!",
            data: {
                deleted: deleted
            }
        })
        
    }
    catch(err){

        return res.json(500, {
            message: 'Internal Server Error',
        })

    }
}