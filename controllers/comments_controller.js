const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req, res){

    Post.findById(req.body.post)
    .then(post => {
        if(post){     //post here is the result of the query ie. the document or record that was found in the Db
            Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post,
            })
            .then(comment => {
                post.comment.push(comment);
                post.save();
                res.redirect('/');
            }).catch(err => { 
                console.log('error(sys) in adding comment to the post');
            });
        }

    }).catch(error => {
        console.log("Error(system) in finding the post in the Post schema");
    });
}


module.exports.destroy = function(req, res){

    Comment.findById(req.params.id)
    .then((comment) => {

        if(comment.user.equals(req.user._id)){
            let postId = comment.post;
            comment.deleteOne();
            Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id }})
            .then((post) => {
                return res.redirect('back');
            });
        }
        else{
            return res.redirect('back');
        }
    })
    .catch((err) => {
        console.log('error(sys) in deleting the comment in the post');

    });
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

