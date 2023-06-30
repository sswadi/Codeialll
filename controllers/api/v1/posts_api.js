const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req,res){

    let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comment',
            populate: {
                path: 'user',
            }
    });



    return res.json(200, {
        message: "List of posts",
        posts: posts
    });
}


module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);

        //instead of ._id here we use id as mongoose automatically converts ._id to id making it easy to compare string==string; .id means converting the obeject to string
        if(post.user.equals(req.user.id)){
            post.deleteOne();

            await Comment.deleteMany({post: req.params.id});

            return res.json(200, {
                message: "Post and associated comment deleted successfully!"
            });

        }else{

            return res.json(401, {
                message: "You cannot delete this post!"
            });
        }

    }catch(err){

        return res.json(500, {
            message: "Internal Server Error"
        });
    }
}