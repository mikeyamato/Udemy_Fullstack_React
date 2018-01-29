// exporting function (with arrow function) so file starts with a lowercase letter

// take in 3 different arguments 
// next is a function is called when the middleware is completed/finished running.
// this is like done, but because middleware can have multiple middleware we are 
// just going to the next one, if there is another middleware. 

module.exports = (req, res, next) => {
	// if user is not logged in...
	if (!req.user) {
		return res.status(401).send({ error: 'You must log in!' });
	}
	// if user is logged in...

	// to continue on if there's no errors
	next();
};