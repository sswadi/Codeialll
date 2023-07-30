const express = require('express');
const cookieParser = require('cookie-parser'); //setting up manual cookie parser
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts'); //requrining ejs layouts for partials and layouts
const db = require('./config/mongoose');
const cors = require('cors');

const session = require('express-session'); // express-session is a lib used to encrypt user id into cookies
const passport = require('passport'); //a middleware and lib used for authetication purposes
const passportLocal = require('./config/passport-local-strategy'); //an added module(strategy) which serves specific purpose in our app
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const MongoStore= require('connect-mongo'); //used to store the session cookie in the db so that everytime the server refreshes the user need nt sign in again and again

// SASS middleware requiring
// const sassMiddleware = require('node-sass-middleware');
//setting up the flash middleware for custom msgs(pop ups)
const flash = require('connect-flash'); 
const customMware = require('./config/middleware'); //custom middleware created by us to tranfer the req msg to res 

app.use(cors());
//for socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer); //settig up file and passing chatServer(created on line 23) to it
chatServer.listen(5000);
console.log('chat server is listening on port 5000');

// app.use(sassMiddleware({
//     src: './assets/scss',
//     dest: './assets/css',
//     debug: true,
//     outputStyle: 'extended',
//     prefix: '/css'
// }));

app.use(express.urlencoded()); //to read post requests where data is sent through url
app.use(cookieParser());

app.use(express.static('./assets'));
//mutler: make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(expressLayouts); //saying out app to use expressLayouts 

//if there are any script tags and style tages within subpages(ie. non layout pages/header/footer), then whle rendering it'll be put into layout
app.set('layout extractStyles', true); 
app.set('layout extractScripts', true);

app.set('view engine', 'ejs'); //setting up view engine
app.set('views', './views');


//a middleware that takes in the session cookie and encrytps it
app.use(session({
    //this piece of code is used for encrytpitng the session cookie when serializeUser is called(in passport-local-strategy)
    name: 'codeialll',
    //todo - change the secret key before deployment before production
    secret: 'randomsecretkey',
    saveUninitialized: false, //when the user data/identity is not established we would not require to store that data, hence it is set to false 
    resave: false, //resave prevents the user data present in the session to cookie to read-write again if there is no change in the data
    cookie: {
        maxAge: (1000 * 60 * 100) //this is in milliseconds which sums upto be the no. minutes => 1 sec = 1000 ms | 1 min = 60 sec | 100 = minutes
    },
    //mongoStore is used to store the session cookie in the db 
    store: MongoStore.create(
        
        {
            mongoUrl: 'mongodb://localhost/Codeialll',
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err || 'connect mongodb setup ok');
        }
    )
}));

// The app.use(session({ ... })) middleware is responsible for managing the session data in the application. 
// It enables the server to store and retrieve session data for each user. 
// It configures various session options such as the session name, secret key for encryption, 
// cookie settings, and the session store (in this case, MongoDB using connect-mongo). 
// The session middleware is necessary to create and maintain a session for each user and store session-related data securely.

app.use(passport.initialize()); //tells app to use initialise method in passport
app.use(passport.session()); //tells app to use session method in passport

app.use(passport.setAutheticatedUser);//setting the current user usage

app.use(flash());
app.use(customMware.setFlash);

app.use('/', require('./routes/users')); //setting up routess

app.listen(port, function(err){
    if(err){
        console.log('Error in connecting to the server!');
    }
    console.log(`Server running successfully at port: ${port}`);
});