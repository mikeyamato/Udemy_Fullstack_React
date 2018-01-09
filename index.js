// import express library
const express = require ('express');
// we'll use the express library for the app
const app = express();

// create route handler with two arguments
// arrow function will have 2 arguments, req & res
app.get('/', (req, res) => {
	res.send({ hi: 'there' });
});

// for heroku purpose create a const to let it dictate what port to use. 
// capitalize PORT to let other developers know that this is a constant and
// to be very aware of it and not change it.
// depending on if we are in a dev or production environment we'll add a boolean
// either use heroku's dictated port or use port 5000
const PORT = process.env.PORT || 5000; 

// express is telling node to listen to port 5000
// app.listen(5000);
app.listen(PORT);
