const express = require('express');
const router = express.Router();
const passport = require('passport'); 

const usersController = require('../controllers/users_controller');
const homeController = require('../controllers/home_controller');

router.get('/', homeController.home);

router.get('/sign_up', usersController.signUp);
router.get('/sign_in', usersController.signIn);

router.post('/create', usersController.create);
// router.post('/create-session', usersController.createSession); //this is for manual authetication

//use passport as a middleware to autheticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/sign_in'}
) , usersController.createSession);

router.get('/profile', passport.checkAuthetication ,usersController.profile);

module.exports = router;