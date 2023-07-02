const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');

module.exports.create =async function(req, res){

    try{
        let post = await Post.findById(req.body.post);
    
        if(post){     //post here is the result of the query ie. the document or record that was found in the Db
            let comment = await Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post,
            });

            post.comment.push(comment);
            post.save();

            comment = await comment.populate('user', 'name email');
            commentsMailer.newComment(comment);

            if(req.xhr){

                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment created!"
                });

            }

            req.flash('success', 'Comment Published!');
            res.redirect('/');

        }

    }catch(error) {
        // console.log("Error(system) in finding the post in the Post schema");
        console.log("Error: " + error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
}


module.exports.destroy = async function(req, res){

    try{

        let comment = await Comment.findById(req.params.id);
    
        if(comment.user.equals(req.user._id)){
            let postId = comment.post;
            comment.deleteOne();
            let post = await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id }});
            return res.redirect('back');
        }else{
            return res.redirect('back');
        }

    }catch(err){
        console.log('error(sys) in deleting the comment in the post');
    };
}





































// module.exports.destroy = function(req, res){

//     const commentId = req.body._id;

//     Post.findById(commentId)
//     .then((comment) => {
//         if(comment){

//             Comment.deleteOne(commentId);
//             Post.comment.deleteOne(commentId);

//         }else{
//             console.log('Could not find the post. Try again!');
//             return res.redirect('back');
//         }
//     })
//     .catch((err) => {

//     });
// }

