// product keys here. unique set. 

module.exports = {
	// each one of the keys below will be pulled from heroku
	// 'process.env' means to look up the environment variables
	
	// find the environment variable called google client id
	// by convention words are in caps and separated by an
	// underscore
	googleClientID: process.env.GOOGLE_CLIENT_ID,
	googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
	linkedInClientID: process.env.LINKEDIN_CLIENT_ID,
	linkedInClientSecret: process.env.LINKEDIN_CLIENT_SECRET,
	githubClientID: process.env.GITHUB_CLIENT_ID,
	githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
	mongoURI: process.env.MONGO_URI,
	cookieKey: process.env.COOKIE_KEY 
};