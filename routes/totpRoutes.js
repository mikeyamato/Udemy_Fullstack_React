// file not need. all on authRoutes.js


const passport = require ('passport');
const mongoose = require ('mongoose');
const Totp = mongoose.model('totp');
const requireLogin = require('../middlewares/requireLogin');
const utils = require ('../utils/utils');
const base32 = require ('thirty-two');

module.exports = app => {


// ********* TOTP OAuth *********
	
	// app.get('/', function(req, res){
	// 	res.render('index', { user: req.user });
	// });

	// To view account details, user must be authenticated using two factors
	app.get('/auth/account', requireLogin, ensureSecondFactor, (req, res) => {
		res.render('account', { user: req.user });
	});

	app.get('/auth/setup', requireLogin, (req, res, next) => {
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
				
				res.json({ 
					user: req.user, 
					key: encodedKey, 
					qrImage: qrImage 
				});

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
					// res.send(req);
					// res.render('setup', { 
					// 	// user: req.user, 
					// 	// key: encodedKey, 
					// 	// qrImage: qrImage 
					// });

					const totpSetup = { 
						googleId: req.user.googleId,
						// email: req.user.emails.value,
						key: key,
						period: 30
					};

					Totp(totpSetup).save();
				});
			} else {
				return res.redirect('/skip-setup-login-using-2fa');
			}
		});
	});

	app.get('/skip-setup-login-using-2fa', (req, res) => {
		console.log("Hey there!");
	})

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
	
	app.get('/auth/login-otp', requireLogin, (req, res, next) => {
		// If user hasn't set up two-factor auth, redirect
		Totp.findOne({googleId: req.user.id}, (err, user) => {
			if (err) { 
				return next(err); 
			}
			if (!user) { 
				return res.redirect('/auth/setup'); 
			}
			return next();
		});
	}, (req, res) => {
		res.render('login-otp', { 
			user: req.user, 
			message: req.flash('error') });
		}
	);
	
	app.post(
		'/auth/login-otp', 
		passport.authenticate('totp', { failureRedirect: '/auth/login-otp' }),
		(req, res) => {
			req.session.secondFactor = 'totp';
			res.redirect('/');
		}
	);
	
	function ensureSecondFactor(req, res, next) {
		if (req.session.secondFactor == 'totp') { return next(); }
		res.redirect('/auth/login-otp')
	}


	
	
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














