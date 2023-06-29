const User = require('../../../models/user');
const jwt = require('jsonwebtoken');


//http://localhost:8000/create-session
//assuming user has signed in
module.exports.createSession = async function(req, res){

    try{

        let user = await User.findOne({email: req.body.email});

        if( !user || user.password != req.body.password){
            return res.json(422, {
                message: "Invalid username/password"
            });
        }

        return res.json(200, {
            message: "Sign in successful, here is your token, please keep it safe!",
            data: {
                token: jwt.sign(user.toJSON(), 'codeial', {expiresIn: '1000'})
            }
        });

    }catch(err){
        console.log('***api-> v1-> users_api***', err);
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
       
}