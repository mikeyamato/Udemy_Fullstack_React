// passport below has nothing to do with 'passport.js'
// this is for the passport npm package
const passport = require ('passport');

// wrap the routes in a fat arrow function to define 'app'. currently 'app'
// is defined in 'index.js'
// we're going to assume that we'll be calling this function with our express
// app object. therefore add 'app' as an argument to this function
module.exports = app => {

	/*
	// create route handler with two arguments
	// arrow function will have 2 arguments, req & res
	app.get('/', (req, res) => {
		res.send({ bye: 'buddy' });
	});
	*/

	// ********* Google OAuth *********	

	// add a single route handler so the server knows where to route traffic
	// after the route, the 2nd arguement will tie in passport
	app.get(
		'/auth/google', 
		// while we didn't explicitely state "google = x" passport understands if
		// we just call 'google'
		passport.authenticate('google', {
			// we are stating what access we want to have inside the users profile
			// these are just 2 predefined items by google
			scope: ['profile', 'email']
		})
	);

	// although this looks very similar to when we are requesting authorization,
	// passport understands it needs to do something else because a 'code' string 
	// is attached in the URL
	app.get('/auth/google/callback', passport.authenticate('google'));

	
	// ********* LinkedIn OAuth *********
	app.get(
		'/auth/linkedin',
		passport.authenticate('linkedin', {
			scope: ['r_basicprofile', 'r_emailaddress']
		})
	);
	
	app.get('/auth/linkedin/callback', passport.authenticate('linkedin'));
	
	// ********* Github OAuth *********
	app.get(
		'/auth/github',
		passport.authenticate('github', {
			scope: ['profile', 'email']
		})
	);
	
	app.get('/auth/github/callback', passport.authenticate('github'));
	
	// ********************************

	// logout route
	app.get('/api/logout', (req, res) => {
		// logout automatically attached to the request object by passport 
		// logout takes the cookie and kills the uid in it
		req.logout();
		// tell the user they are no longer signed in
		res.send(req.user);
	});

	// add a 3rd route handler that will deal with anyone making a get request to 
	// the app. 1st argument, route name is arbitrary. 2nd argument, pass an arrow
	// function. this will be automatically called when someone makes a 
	// get request to the route. add the 'req' and 'res' argument objects to
	// this function
	app.get('/api/current_user', (req, res) => {
		res.send(req.user);
	});
	
};