// keys.js, figure out what credentials to return

if (process.env.NODE_ENV === 'production'){
	// we are in production - return the prod set of keys
	// 'NODE_ENV' will be defined by Heroku automatically 
	module.exports = require ('./prod');
} else {
	// we are in development - return the dev set of keys
	// environment variable will not appear
	// on the local machine, we always fall into the else
	// statement. 
	// if we fall into here, we export & require all of 
	// the code out of 'dev.js' at the same time.
	// 'module.exports' sends the data to whoever is asking
	// for it. 
	module.exports = require ('./dev');
}