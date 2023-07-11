const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.createPost = async function(req, res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user
        });

        if(req.xhr){  //as the type of AJAX req is XMLHTTP Req(ie. XHR)

            post = await post.populate('user', 'name').execPopulate(); //this might throw an error changed on 5th July'23

            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post Created!!"
            });
        }

        req.flash('success', 'Post published');
        return res.redirect('back') 

    }catch(err){
        req.flash('error', err);
        return res.redirect('back');
    }  
}

module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);

        //instead of ._id here we use id as mongoose automatically converts ._id to id making it easy to compare string==string; .id means converting the obeject to string
        if(post.user.equals(req.user.id)){

            // CHANGE(likes controller) :: delete the associated likes for the post and all its comments' likes too
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});

            post.deleteOne();

            await Comment.deleteMany({post: req.params.id});

            if(req.xhr){  //as the type of AJAX req is XMLHTTP Req(ie. XHR)
                return res.status(200).json({
                    data: {
                        post_id: req.params.id,
                    },
                    message: "Post Deleted Successfully!!"
                });
            }

            req.flash('success', 'Post & associated comments deleted!');
            return res.redirect('back');
        }else{

            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }

    }catch(err){

        req.flash('error', err);
        console.log('error(sys) in deleting a post');
        return res.redirect('back');
    }
}