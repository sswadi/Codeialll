const express = require('express');
const router = express.Router();
const passport = require('passport'); 

const usersController = require('../controllers/users_controller');
const homeController = require('../controllers/home_controller');
const postsController = require('../controllers/posts_controller');
const commentsController = require('../controllers/comments_controller');
const likesController = require('../controllers/likes_controller');
const { route } = require('./api');

// router.use('/likes', require('./likes'));

router.get('/', homeController.home);

router.get('/profile/:id', passport.checkAuthetication , usersController.profile);
router.post('/users/update/:id', passport.checkAuthetication , usersController.update);

router.get('/sign_up', usersController.signUp);
router.get('/sign_in', usersController.signIn);

// router.post('/create', passport.checkAuthetication ,usersController.create); //delete it after reviewing why you had put passport.checkauth here???
router.post('/create',usersController.create);
// router.post('/create-session', usersController.createSession); //this is for manual authetication

//use passport as a middleware to autheticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/sign_in'}
) , usersController.createSession);

router.get('/sign_out', usersController.destroySession);

router.post('/createPost', postsController.createPost);

router.post('/comments/create', passport.checkAuthetication, commentsController.create);

router.get('/destroy/:id', passport.checkAuthetication, postsController.destroy );

router.get('/comments/destroy/:id', passport.checkAuthetication, commentsController.destroy );

//setting up routes for api
router.use('/api', require('./api'));


router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/sign_in'}), usersController.createSession);

router.post('/likes/toggle/', likesController.toggleLike);

module.exports = router;