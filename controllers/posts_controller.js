const Post = require('../models/post');


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