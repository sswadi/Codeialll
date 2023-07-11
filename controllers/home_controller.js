const Post = require('../models/post');
const User = require('../models/user');



module.exports.home = async function(req,res){

    try{
        // CHANGE(likes controller):: populate the likes of each post and comment
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comment',
            populate: {
                path: 'user',
            },
            populate: {
                path: 'likes'
            }
        }).populate('likes');

    let users = await User.find({})

    return res.render('home', {
        title: "Home",
        posts: posts,
        all_users: users
    });

    }catch(err){
        // Send an appropriate response to the client
        return res.status(500).send("An error occurred");
    }

    
}
