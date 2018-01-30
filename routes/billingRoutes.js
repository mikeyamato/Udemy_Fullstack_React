const keys = require('../config/keys');
// import stripe but also bring in the secret key (look at documentation)
// how to access our key inside our server side project, require
// 'keys.js'
const stripe = require('stripe')(keys.stripeSecretKey); 
// require authentication only for '/api/stripe' by requiring middleware here vs. 
// in server 'index.js'
const requireLogin = require('../middlewares/requireLogin');


// create an arrow function and immediately export it
module.exports = app => {
	// route handler
	// 2nd argument will be the authentication middleware just for '/api/stripe'. 
	// we aren't making this 'requireLogin()' because we don't want express to execute
	// this the first time this gets loaded in. we only want this function to fun when
	// it is called specifically. 
	// express can have as many arguments just as long as one of the functions processes
	// the request and send back a response to the user. 
	// 3rd argument, pass in the response handler (req, res) object
	app.post('/api/stripe', requireLogin, async (req, res) => {
		// if (!req.user) {
		// 	return res.status(401).send({ error: 'You must log in! '});
		// }
		
		// logic to handle the token, reach out to the stripe api, and 
		// finalize the actual charge. and afterwards update the user's
		// number of credits. 
		// req.body is what returns

		const charge = await stripe.charges.create({
			amount: 500,
			currency: 'usd',
			description: '$5 for 5 credits',
			source: req.body.id // obtained with Stripe.js
		});
		req.user.credits += 5;
		const user = await req.user.save();
		res.send(user);
	});
};