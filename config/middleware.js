module.exports.setFlash = function(req, res, next){
    res.locals.flash = {                  //setting value in response's local
        'success' : req.flash('success'),
        'error' : req.flash('error')

    }

    next();
}


// In Express.js, res.locals is an object that holds local variables scoped to the request-response cycle. 
// It provides a way to pass data from middleware to view templates without explicitly adding them to each rendered view's local variables.