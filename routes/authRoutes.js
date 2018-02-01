// passport below has nothing to do with 'passport.js'
// this is for the passport npm package
const passport = require ('passport');

const mongoose = require ('mongoose');
const User = mongoose.model('users');
const Totp = mongoose.model('totp');
const requireLogin = require('../middlewares/requireLogin');
const utils = require ('../utils/utils');
const base32 = require ('thirty-two');


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
			scope: ['profile', 'email'],
			// make sure we are given a prompt of what account to use when logging in
			prompt: "select_account"
		})
	);

	// although this looks very similar to when we are requesting authorization,
	// passport understands it needs to do something else because a 'code' string 
	// is attached in the URL. so when someone goes to '/auth/google/callback' we
	// are passing the user off to the 'passport.authenticate' function. this 
	// authenticate function is middleware. after 'passport.authenticate' has been 
	// authenticated we need to instruct what to do next. do this by chaining on 
	// another route handler. 
	app.get(
		'/auth/google/callback', 
		passport.authenticate('google'),
		(req, res) => {
			// whenever a request comes to this function we are going to redirect who-
			// ever is making this request off to someother route inside this app. 
			// res (response) has a function attached to it called 'redirect'. 'redirect'
			// will push the user to '/surveys'
			res.redirect('/surveys');
		}
	);


	// ********* TOTP OAuth *********
	
	// app.get('/', function(req, res){
	// 	res.render('index', { user: req.user });
	// });

	// To view account details, user must be authenticated using two factors
	app.get('/account', requireLogin, ensureSecondFactor, (req, res) => {
		res.render('account', { user: req.user });
	});

	app.get('/setup', requireLogin, (req, res, next) => {
		Totp.findOne({ googleId: req.user.googleId }, (err, user) => {
			// const = user;
			// const secretKey = user.key
			// const googleIdentification= req.user.googleId

			console.log('first pull - user: ', user);
			// console.log('first pull - google id: ', { googleId: user.googleId} || null);
			// console.log('first pull - id: ', user.googleId || null );
			

			if (err) { 
				return next(err); 
			}
			
			if (user) {
				// two-factor auth has already been setup
				var encodedKey = base32.encode(user.key);
				
				// generate QR code for scanning into Google Authenticator
				// reference: https://code.google.com/p/google-authenticator/wiki/KeyUriFormat
				var otpUrl = 'otpauth://totp/' + req.user.email
									+ '?secret=' + encodedKey + '&period=' + (user.period || 30) + '&issuer=Bitch%20Ass';
				var qrImage = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(otpUrl);
				
				console.log('user exist - req.user ', user);
				console.log('user exist - key ', user.key);
				console.log('user exist - qrImage ', qrImage);
				
				// res.render('setup', { 
				// 	user: req.user, 
				// 	key: encodedKey, 
				// 	qrImage: qrImage 
				// });

			} 
			if (!user) {
				// new two-factor setup.  generate and save a secret key
				var key = utils.randomKey(10);
				var encodedKey = base32.encode(key);
				
				// generate QR code for scanning into Google Authenticator
				// reference: https://code.google.com/p/google-authenticator/wiki/KeyUriFormat
				var otpUrl = 'otpauth://totp/' + req.user.email
										+ '?secret=' + encodedKey + '&period=30&issuer=Yo%20Momma';
				var qrImage = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(otpUrl);
		
				Totp.findOne({ googleId: req.user.id }, { key: key, period: 30 }, (err) => {
					if (err) { 
						return next(err); 
					}
					console.log('no user exist - user ', user);
					console.log('no user exist - key ', key);
					console.log('no user exist - qrImage ', qrImage);
					// res.sendFile({qrImage});
					// res.render('setup',  {
					// res.json({ qrImage: qrImage });
					// 	// user: req.user, 
					// 	// key: encodedKey, 
					// 	qrImage: qrImage
					// 	// qrImage
					// 	// 'hello'
					// });


					const totpSetup = { 
						googleId: req.user.googleId,
						// email: req.user.emails.value,
						key: key,
						period: 30
					};
					// save to db
					Totp(totpSetup).save();
				});
			} else {
				// go sign in
				// should this go back home? this is for people who can't sign in, right?
				return res.redirect('/login-otp');
			}
		});
	});

	// app.get('/login', (req, res) => {
	// 	res.render('login', { 
	// 		user: req.user 
	// 	});
	// });

	// app.post('/login', passport.authenticate('google', { 
	// 	failureRedirect: '/login' 
	// }),
	// 	(req, res) => {
	// 		res.redirect('/');
	// 	}
	// );
	
	app.get('/login-otp', requireLogin, (req, res, next) => {
		// If user hasn't set up two-factor auth, redirect
		Totp.findOne({googleId: req.user.googleId}, (err, user) => {
			console.log('&&&&&&&&&&&&&&&&& /auth/login-otp - id: ',  {googleId: req.user.googleId});
			console.log('&&&&&&&&&&&&&&&&& /auth/login-otp - user: ',  user);
			if (err) { 
				return next(err); 
			}
			if (!user) { 
				return res.redirect('/setup'); 
			}
			return next();
		});
	// }, (req, res) => {
	// 	console.log('$$$$$$$$$$$$ req.user: ', req.user)
	// 	// res.render('login-otp', { 
	// 	// 	user: req.user, 
	// 	// 	message: req.flash('error') });
		}
	);
	
	// get the otp code back
	app.post(
		'/login-otp', 
		passport.authenticate('totp', { 
			failureRedirect: '/login-otp' 
		}),
		(req, res) => {
			req.session.secondFactor = 'totp';
			res.redirect('/');
		}
	);
	
	// used for signing into 'account'
	function ensureSecondFactor(req, res, next) {
		if (req.session.secondFactor == 'totp') { return next(); }
		res.redirect('/login-otp')
	}


	


	// ********* LinkedIn OAuth *********
	app.get(
		'/auth/linkedin',
		passport.authenticate('linkedin', {
			scope: ['r_basicprofile', 'r_emailaddress']
		})
	);
	
	app.get('/auth/linkedin/callback', passport.authenticate('linkedin'),
	(req, res) => {
		// whenever a request comes to this function we are going to redirect who-
		// ever is making this request off to someother route inside this app. 
		// res (response) has a function attached to it called 'redirect'. 'redirect'
		// will push the user to '/surveys'
		res.redirect('/surveys');
	}
);
	
	// ********* Github OAuth *********
	app.get(
		'/auth/github',
		passport.authenticate('github', {
			scope: ['profile', 'email']
		})
	);
	
	app.get('/auth/github/callback', passport.authenticate('github'),
	(req, res) => {
		// whenever a request comes to this function we are going to redirect who-
		// ever is making this request off to someother route inside this app. 
		// res (response) has a function attached to it called 'redirect'. 'redirect'
		// will push the user to '/surveys'
		res.redirect('/surveys');
	}
);
	
	// ********************************

	// logout route
	app.get('/api/logout', (req, res) => {
		// logout automatically attached to the request object by passport 
		// logout takes the cookie and kills the uid in it
		req.logout();
		// tell the user they are no longer signed in by going back to the root
		// route
		res.redirect('/');
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














