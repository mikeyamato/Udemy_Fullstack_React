const mongoose = require ('mongoose');
// pull one property from mongoose, the schema
// const Schema = mongoose.Schema; 
// since the variable is the same as the path we can destructure this.
// this is the same as above. es2015. 
const { Schema } = mongoose; 

// while records in mongo can have one-off schema, mongoose doesn't like that
// fact. we need to adjust to make mongoose happy

const userSchema = new Schema ({
	// the object here will describe all the different properties we have
	// new schemas can be added/removed anytime

	// we need a property of 'googleId' with a type of 'String'
	// although the id is a set of numbers it was wrapped inside a string
	googleId: String,
	linkedInId: String,
	githubId: String
});

// to create a model class and tell mongoose to be aware that a new collection 
// needs to be created add the following. the 1st arguement will be the name
// of the collection, `users`. 2nd argument will be `userSchema`
// mongoose will not overwrite data when it starts up everytime. it just
// makes note that it already exists
mongoose.model('users', userSchema);