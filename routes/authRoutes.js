// passport below has nothing to do with 'passport.js'
// this is for the passport npm package
const passport = require ('passport');

const mongoose = require ('mongoose');
const User = mongoose.model('users');
const Totp = mongoose.model('totp');
const requireLogin = require('../middlewares/requireLogin');
const utils = require ('../utils/utils');
const base32 = require ('thirty-two');
const flash = require('connect-flash');
const session = require('express-session');



mongoose.Promise = global.Promise;

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
			// if totp key has been created then redirect to login page
			// if not then redirect to landing page
			Totp.findOne(req._id, (err, user) => {
				// console.log('first pull - user: ', user);
				if (err) { 
					return next(err); 
				} if (user) {
					// console.log('***** user, 1st pull', user);
					res.redirect('/login-otp');
				} else {
					res.redirect('/surveys');
				}
			});
			
			// res.redirect('/surveys');

		}
	);


	// ********* TOTP OAuth *********
	
	// when creating QR code. must be logged in. 
	app.get('/auth/setup', requireLogin, (req, res, next) => {
		console.log('*************************');
		console.log('*** get route: /setup ***');
		console.log('*************************');
		console.log('********* /auth/setup req.session: ', req.session);
		
		const id = req.session.passport.user;
		console.log('$$$$$$$$$$$$ id ', id)
		Totp.findOne({_id:id}, (err, user) => {

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
									+ '?secret=' + encodedKey + '&period=' + (user.period || 30) + '&issuer=Grouper:%20Mother%20Fucking%20Bitch';
				var qrImage = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(otpUrl);
				
				console.log('user exist - user._id ', user._id);
				console.log('user exist - key ', user.key);
				console.log('user exist - qrImage ', qrImage);
				
				res.json({qrImage: qrImage});
				
			} 
			else {
				// new two-factor setup.  generate and save a secret key
				var key = utils.randomKey(10);
				var encodedKey = base32.encode(key);
				
				// generate QR code for scanning into Google Authenticator
				// reference: https://code.google.com/p/google-authenticator/wiki/KeyUriFormat
				var otpUrl = 'otpauth://totp/' + req.user.email
										+ '?secret=' + encodedKey + '&period=30&issuer=Grouper:%20Mother%20Fucking%20Bitch';
				var qrImage = 'https://chart.googleapis.com/chart?chs=166x166&chld=L|0&cht=qr&chl=' + encodeURIComponent(otpUrl);
		
				Totp.findOne(req._id, { key: key, period: 30 }, (err) => {
					if (err) { 
						return next(err); 
					}
					console.log('no user exist - req.user._id ', req.user._id);
					console.log('no user exist - key ', key);
					console.log('no user exist - qrImage ', qrImage);

					const totpSetup = { 
						_id: req.user._id,
						// email: req.user.emails.value,
						key: key,
						period: 30
					};
					// save to db
					Totp(totpSetup).save();
					
					res.json({qrImage: qrImage});
				});
			}
		});
	});
	
	// before entering 6-digit code, checks to see if user has the QR code setup 
	app.get('/auth/login-otp', requireLogin, (req, res, next) => {
		console.log('**********************************');
		console.log('*** get route: /auth/login-otp ***');
		console.log('**********************************');
		// If user hasn't set up two-factor auth, redirect
		Totp.findOne(req._id, (err, user) => {
			console.log('&&&&&&&&&&&&&&&&& /auth/login-otp - id: ',  req._id);
			console.log('&&&&&&&&&&&&&&&&& /auth/login-otp - user: ',  user);
			if (err) { 
				return next(err); 
			}
			if (!user) { 
				console.log('333333333333 not user')
				return res.redirect('/'); 
			}
			// else do nothing
		});
		}
	);

	// To view account details, user must be authenticated using two factors
	app.get('/auth/account', requireLogin, ensureSecondFactor, (req, res) => {
		res.render('account', { user: req.user });
	});

	// used for signing into 'account'
	function ensureSecondFactor(req, res, next) {
		if (req.session.secondFactor == 'totp') { return next(); }
		// if not signed in then go back home (or anywhere)
		res.redirect('/')
	}

	
	// get the otp code back
	app.post(
		'/auth/login-otp', 
		passport.authenticate('totp',  { 
			// failureRedirect: '/auth/login-otp',
			// failureFlash: true 
		}),
		
		function(err, user, info) {
			console.log("****** authenticate ******");
			console.log(err);
			console.log(user);
			console.log(info);
		}

		// function (req, res) {
		// 	console.log('****** authenticate req.session before ', req.session)
		// 	req.session.secondFactor = 'totp';
		// 	console.log('****** authenticate req.session after ', req.session)
		// 	res.redirect('/surveys');
		// }
	);
	






	


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














