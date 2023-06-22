const Post = require('../models/post');

module.exports.home = function(req,res){

    Post.find({}).populate('user')
    .populate({
        path: 'comment',
        populate: {
            path: 'user',
        }
    })
    .then((posts) => {
        return res.render('home', {
            title: "Home",
            posts: posts
        });
    })
    .catch((err) => {
        // Send an appropriate response to the client
        return res.status(500).send("An error occurred");
    })
    
}
