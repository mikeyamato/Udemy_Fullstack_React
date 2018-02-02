// file not need. all on authRoutes.js


const passport = require ('passport');
const mongoose = require ('mongoose');
const Totp = mongoose.model('totp');
const requireLogin = require('../middlewares/requireLogin');
const utils = require ('../utils/utils');
const base32 = require ('thirty-two');

module.exports = app => {

	// ********************************

	// add a 3rd route handler that will deal with anyone making a get request to 
	// the app. 1st argument, route name is arbitrary. 2nd argument, pass an arrow
	// function. this will be automatically called when someone makes a 
	// get request to the route. add the 'req' and 'res' argument objects to
	// this function
	app.get('/api/current_user', (req, res) => {
		res.send(req.user);
	});


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

	
};














