const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users_controller');
const homeController = require('../controllers/home_controller');

router.get('/', homeController.home);

router.get('/sign_up', usersController.signUp);
router.get('/sign_in', usersController.signIn);

router.post('/create', usersController.create);
router.post('/create-session', usersController.createSession);
router.get('/profile', usersController.profile);

module.exports = router;