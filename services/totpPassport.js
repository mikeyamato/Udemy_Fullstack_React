const passport = require('passport');
const TotpStrategy = require('passport-totp').Strategy;
const mongoose = require ('mongoose');
// const keys = require('../config/keys');

const Totp = mongoose.model('totp');

mongoose.Promise = global.Promise;

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	Totp.findById(id).then(user => {
		done(null, user);
	});
});


passport.use(
	new TotpStrategy(
  function(totp, done) {
    // setup function, supply key and period to done callback
    Totp.findOne({ googleId: req.user.id }, (err, obj) => {
			console.log('*********obj: ', obj);
			if (err) { 
				return done(err); 
			}
      return done(null, obj.key, obj.period);
    });
  }
));




