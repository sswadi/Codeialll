const User = require('../models/user');

//http://localhost:8000/profile
module.exports.profile = function(req, res){
    return res.render('user_profile', {
        title: 'User Profileee',
    })
}

//http://localhost:8000/sign_in
module.exports.signUp= function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/profile');
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
            // User.create(req.body)
            .then(newUser => {
                return res.redirect('/sign_in');
            })
            .catch(err => {
                console.log('Error in creating user while signing up', err);
                return;
            });
        }else{
            // return res.redirect('back');
            console.log('User already present; redirecting to Sign-Ins');
            return res.redirect('/sign_in');
        }
    }).catch(error => {
        console.log('Error(system) in finding the user in signing up. Please try again', error);
        return;
    });
}

//http://localhost:8000/create-session
//assuming user has signed in
module.exports.createSession = function(req, res){
    return res.redirect('/');   
}

module.exports.destroySession = function(req, res){

    req.logout(function(err) {
        if (err) { 
            return next(err); 
        }
        return res.redirect('/');
    });
}
















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