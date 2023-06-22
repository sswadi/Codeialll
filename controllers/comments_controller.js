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

