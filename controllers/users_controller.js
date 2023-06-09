const User = require('../models/user');
const fs = require('fs');
const path = require('path');

//http://localhost:8000/profile/id:
module.exports.profile = function(req, res){
    User.findById(req.params.id)
    .then(user => {
        return res.render('user_profile', {
            title: 'User Profileee',
            profile_user: user,
        });
    })
    .catch(err => { 
        console.log("error(sys) in find the user");
    }); 
}

//http://localhost:8000/users/update/:id
module.exports.update = async function(req, res){

    if(req.user.id == req.params.id){

        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log('***Multer Error: ', err);
                }
                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){

                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..' , user.avatar));
                    }

                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }

                user.save();
                return res.redirect('back');

            });

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');    
        }
        
    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }

}

//http://localhost:8000/sign_in
module.exports.signUp= function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/profile'); //not sure if you need isAuth check here?? Even in signIn actually!
    }
    return res.render('user_sign_up', {
        title: 'User Sign-Up'
    });
}

//http://localhost:8000/sign_up
module.exports.signIn= function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/profile');
    }
    return res.render('user_sign_in', {
        title: 'User Sign-In'
    });
}

//http://localhost:8000/create
module.exports.create = function(req, res){
    
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }
    User.findOne({email: req.body.email})
    .then((user)=> {
        if(!user){
            return User.create(req.body)
            .then(newUser => {
                return res.redirect('/sign_in');
            })
            .catch(err => {
                console.log('Error in creating user while signing up', err);
                return;
            });
        }else{
            // return res.redirect('back');
            console.log('User already present; redirecting to Sign-Up. Please try again buddy(with diff credentials)!');
            return res.redirect('/sign_up');
        }
    }).catch(error => {
        console.log('Error(system) in finding the user in signing up. Please try again', error);
        return;
    });
}

//http://localhost:8000/create-session
//assuming user has signed in
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in successfully');
    return res.redirect('/');   
}

module.exports.destroySession = function(req, res){

    req.logout(function(err) {
        if (err) { 
            return next(err); 
        }
        req.flash('success', 'Logged out successfully');
        return res.redirect('/');
    });
}


// Flash messages are often set during the processing of a request, 
// and their purpose is to provide feedback or notifications to the user on subsequent requests.
// By using req.flash, the flash message is stored in a temporary session storage associated with the client's request. 
// The req.flash function adds the flash message to the session data, 
// which can be accessed later when rendering views or handling subsequent requests.












//--------------------------------------------------------------------------------
//http://localhost:8000/users/create-session
//this is for manual authetication
// module.exports.createSession = function(req, res){

//     User.findOne({email: req.body.email})
//     .then(user => {
//         if(!user){
//             return res.redirect('back');
//         }else{
//             if(user.password != req.body.password){
//                 return res.redirect('back');
//             }
//             res.cookie('user_id', user.id);
//             return res.redirect('/profile');
//         }
//     })
//     .catch(err =>{
//         console.log('Error(system) in finding the user in signing in. Please try again', err);
//         return;
//     });   
// }


//http://localhost:8000/profile
//this was used for manual auth
// module.exports.profile = function(req, res){
//     if(req.cookie.user_id){ 
//         User.findById(req.cookies.user_id)
//         .then( user => {
//             return res.render('user_profile', {
//                 title: 'User Profile',
//                 user: user
//             });
//         })
//         .catch(err => {
//             console.log('error(system) in fething the user id; pls try again');
//         } );
//     }else{
//          return res.redirect('/sign_in');       
//     }
// }


//http://localhost:8000/users/create
// module.exports.create = function(req, res){
//     if(req.body.password != req.body.confirm_password){
//         return res.redirect('back');
//     }

    //while signing up, we check if the email entry already exists in db, if not we create a new user freshly
    // User.findOne({email: req.body.email}, function(err, user){
    //     if(err){
    //         console.log('Error(system) in finding the user in signing up. Please try again');
    //         return;
    //     }
    //     //if user not found in db, create one
    //     if(!user){
    //         User.create(req.body, function(err,user){
    //             if(err){
    //                 console.log('Error in creating user whiles signing up');
    //                 return;
    //             }else{
    //                 return res.redirect('/user/sign-in');
    //             }
    //         });
    //     }else{
    //         return res.redirect('back');
    //     }
    // });