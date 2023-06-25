const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req,res){

    Post.find({}).populate('user')
    .populate({
        path: 'comment',
        populate: {
            path: 'user',
        }
    })
    .then((posts) => {

        User.find({})
        .then(users => {

            return res.render('home', {
                title: "Home",
                posts: posts,
                all_users: users
            });

        })
       
    })
    .catch((err) => {
        // Send an appropriate response to the client
        return res.status(500).send("An error occurred");
    })
    
}
