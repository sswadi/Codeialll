const express = require('express');
const cookieParser = require('cookie-parser'); //setting up manual cookie parser
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts'); //requrining ejs layouts for partials and layouts
const db = require('./config/mongoose');

app.use(express.urlencoded()); //to read post requests where data is sent through url
app.use(cookieParser());

app.use(express.static('./assets'));

app.use(expressLayouts); //saying out app to use expressLayouts 

//if there are any script tags and style tages within subpages(ie. non layout pages/header/footer), then whle rendering it'll be put into layout
app.set('layout extractStyles', true); 
app.set('layout extractScripts', true);

app.use('/', require('./routes/users')); //setting up routess

app.set('view engine', 'ejs'); //setting up view engine
app.set('views', './views');







app.listen(port, function(err){
    if(err){
        console.log('Error in connecting to the server!');
    }
    console.log(`Server running successfully at port: ${port}`);
});