// we'll use the express library for the app
const passport = require('passport');
// this module has a few properties. we are only interested in 'strategy' 
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const mongoose = require ('mongoose');
// add keys from keys.js
const keys = require('../config/keys');

// get access to the user model class. 'User' is our model class. 
// 1 argument means we are trying to fetch something out of mongoose
const User = mongoose.model('users');

// 'serializeUser' to assist with generating unique tag w/ 2 arguments.
// 'user' is what is pulled from the db
passport.serializeUser((user, done) => {
	// 2 arguments. 1st, error if exists
	// 'profile.id' is not the same as 'user.id'. 'user.id' is a mongo id.
	// we use mongo's id because not everyone has a google id
	// they may have signed in via fb or linkedin
	// 'user.id' is a shortcut path to mongo's id
	done(null, user.id);
});

// take the id that we had previously stuffed in a cookie and turn it 
// back into a user model
passport.deserializeUser((id, done) => {
	User.findById(id).then(user => {
		done(null, user);
	});
});

passport.use(
	
	// ********* LinkedIn OAuth *********

	new LinkedInStrategy(
		{
			// make sure 'ID' is capitalized. do not use 'Id'
			clientID: keys.linkedInClientID,
			clientSecret: keys.linkedInClientSecret,
			// capitalize 'URL'. this is to tell the site where to redirect the callback
			// to. basically the route to use after they grant permission to our app
			callbackURL: '/auth/linkedin/callback',
			// to address http vs https issues. keeps things https
			proxy: true
		// add a 2nd arguement as a fat arrow
		}, 
		async (token, tokenSecret, profile, done) => {
			// console.log('access token', accessToken);
			// console.log('refresh token', refreshToken);
			// console.log('profile', profile.id);

			// use a model class to initiate a search of all records inside the 
			// collection to figure out if there are any repeats
			// this returns a promise
			const existingUser = await User.findOne({ linkedInId: profile.id })
			// checking to see if id exists with a truthy statement
			if (existingUser) {
				// we already have a record with the given profile id

				// to tell passport we are done apply 2 arguments. null and user
				// record, 'existingUser'. 
				return done(null, existingUser);
			}
				// we don't have a user record with this id. make a new record

				// use the model class ('User') to create a new instance of a user who
				// has a google ID of profile.id
				// this creates one insance of a record. this doesn't get saved to the 
				// db automatically. it currently just lives in the express api. 
				// to save we need to add a function, `.save()`, at the end
				const user = await new User ({ linkedInId: profile.id }).save()
					// since the process is async, chain on a promise
					// we are creating another model instance with the promise but 
					// this one is much better to use since things may have been
					// added to it. take the 'user' that was just saved to he db
					// and pass in 2 arguments
				done(null, user);
		}
	)
);

