const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.createPost = function(req, res){

    // console.log('Wait karo bhai...');

    Post.create({
            content: req.body.content,
            user: req.user
    })
    .then(() => { return res.redirect('back') })
    .catch((err) => {
        if(err){
            console.log('error in creating a post');
            return;
        }  
    });
}

module.exports.destroy = function(req, res){

    Post.findById(req.params.id)
    .then((post) => {

        //instead of ._id here we use id as mongoose automatically converts ._id to id making it easy to compare string==string; .id means converting the obeject to string
        if(post.user.equals(req.user.id)){

            post.deleteOne();
            Comment.deleteMany({post: req.params.id})
            .then(()=> {
                return res.redirect('back')
            });
        }else {
            console.log("this is else---");
            return res.redirect('back');
        }
    })
    .catch((err) =>{
        return res.redirect('back');
    } );
}