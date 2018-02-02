// add express library
const express = require ('express');
// require mongoose 
const mongoose = require ('mongoose');
// add cookie function helper
const cookieSession = require ('cookie-session');
// add passport library and make use of cookies
const passport = require ('passport');
// require the bodyParser middleware 
const bodyParser = require('body-parser'); 
// add keys from keys.js
const keys = require('./config/keys');
// add passport from services folder
// since we aren't assigning anything to a variable, a variable isn't needed
require ('./models/User');
require ('./models/Totp');
require ('./services/googlePassport');
require ('./services/linkedinPassport');
require ('./services/githubPassport');
require ('./services/totpPassport');


// connect to mongo by adding the address to mongo within the parens
// get the address from mlab
// but instead of putting it here, place it inside `/config/keys.js`
// i received a deprication warning with `npm run dev`. the following should
// fix that. add a 2nd argument
mongoose.connect(keys.mongoURI, 
	// used to remove deprication warning
	{useMongoClient: true}
);


// 'const authRoutes' is a function that takes our app object and attaches 
// the routes to it. therefore we'll need to call it with 'app' as our object
// below
// const authRoutes = require ('./routes/authRoutes');

const app = express();

// any kind of request (post, put, use, etc.) that has a request-body that 
// comes into our application, the middleware will parse the body 
// and assign it to the req.body property of the incoming request object
app.use(bodyParser.json());

app.use(
	// pass to the function 'app.use()', cookieSession. then to this we're
	// going to call a configuration object. this is middleware. 
	cookieSession({
		// config object expects 2 properties to be contained
		
		// how long the cookie can live in the browser before expiring.
		// we'll say 30 days. time has to be passed as milliseconds.
		// 30 days * 24 hours in a day * 60 minutes in a hour
		// * 60 seconds in a minute * 1000 milliseconds to 1 second
		maxAge: 30 * 24 * 60 * 60 * 1000,
		// key to encrypt our cookie. put the actual key in 'keys.js'.
		// ensure this is an array
		keys: [keys.cookieKey]
	})
);
// tell passport to use cookies to handle authentication. make 2 
// additional calls. this is middleware. 
app.use(passport.initialize());
app.use(passport.session());

// authRoutes(app);

// this has been refactored
require ('./routes/authRoutes')(app);
// this returns a function. the 'require' statement will turn into a 
// function that we immedately call with our express 'app' object
require ('./routes/billingRoutes')(app);
require ('./routes/totpRoutes')(app);

// make sure express behaves correctly in production
// this will run when it's only inside heroku
// 'NODE_ENV' is an environment variable that is set by 
// heroku and must mean we're in 'production' so the code inside will run. 
if (process.env.NODE_ENV === 'production') {
	// express will serve up production assets such as main.js file or main.css 
	// basically a route that express doesn't handle
	// if there are no paths that match what's above, then try looking in
	// 'client/build' first. 
	app.use(express.static('client/build'));

	// express will serve up the index.html (do not confuse with index.js) file if it 
	// doesn't recognize the route. because of order of operation, this will run after
	// 'client/build' is reviewed first
	const path = require ('path');
	app.get('*', (req,res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}



// for heroku purpose create a const to let it dictate what port to use. 
// capitalize PORT to let other developers know that this is a constant and
// to be very aware of it and not change it.
// depending on if we are in a dev or production environment we'll add a boolean
// either use heroku's dictated port or use port 5000
const PORT = process.env.PORT || 5000; 

// express is telling node to listen to port 5000
// app.listen(5000);
app.listen(PORT);
