const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Codeialll');

const db = mongoose.connection; //creating an instance(db)

//db.on('error', ...) sets up an error event listener on the db object; so wherever an error event oocurs the following callback function is executed
db.on('error', console.error.bind(console, "Error connecting to DB")); // The console.error function is used to log an error message to the console, and bind is used to set the console object as the context(this) for the function; bind returns a new function

// Using console.log("error connecting") instead of console.error.bind(console, "Error connecting to DB") would not be the same because:
// console.log is used for general logging purposes and does not explicitly indicate that an error occurred.
// On the other hand, console.error is specifically meant for logging error messages.
// By using console.error, the error message will typically be formatted 
// differently in the console, making it more noticeable and easier to identify as an error.
// The db.on('error', ...) approach allows you to handle and respond to the error event in a more
// flexible and customizable way. For example, you can add additional error handling logic, 
// send error notifications, or perform specific actions based on the type of error that occurred.
// in the absence of 'bind', this would have the value of the global object (window in the browser or global in Node.js), 
// or it could be undefined in strict mode. Thus, additional functionality that relies on this would not work as intended.


db.once('open', function(){
    console.log('Connected to db : MongoDB');
});

module.exports = db;