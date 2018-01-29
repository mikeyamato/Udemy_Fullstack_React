import axios from 'axios'; 
import { FETCH_USER } from './types';

/*
// define the action creator
export const fetchUser = () => {
	// rather than returning an action from the action creator whenver
	// the action creator gets called, it will return a function.
	// single js expression that defines a function that will be returned
	// immediately
	return function(dispatch) {
	
		// use 'axios' to make a network request and pass in the route
		// we care about. you can find the route by going back to 
		// 'routes' > 'authRoutes.js' > look for 'current_user'.
		// only apply the relative path
		axios
			.get('/api/current_user')
			// chain on '.then' and it will be called with a response from
			// the api. when the response comes back then we are ready to 
			// dispatch an action. pass in the action we want to dispatch. 
			.then(res => dispatch({ type: FETCH_USER, payload: res }));
	};
};

// **************** refactor ****************
// refactor by exploiting a rule around arrow functions. if there is a
// curly braces and a return statement and the return statement is being 
// used with a single expression it is okay to remove the curly braces 
// and the 'return' keyword
export const fetchUser = () =>
	function(dispatch) {
		async axios
		.get('/api/current_user')
		const dispatch = .then(res => dispatch({ type: FETCH_USER, payload: res }));
};

// **************** refactor more ****************
// take the 'function' keyword and apply an arrow function on the other side.
// with a single argument, okay to remove the parens. 
export const fetchUser = () =>
	dispatch => {
		async axios
		.get('/api/current_user')
		const dispatch = .then(res => dispatch({ type: FETCH_USER, payload: res }));
};
*/

// **************** refactor more ****************
// use the async/await  
// other action creators in this course will have a similar structure
export const fetchUser = () =>
	async dispatch => {
		const res = await axios.get('/api/current_user')
		// 'res' is the output from 'axios.get('/api/current_user')'
		// it represent the request made to the backend server
		// update from 'res' to 'res.data' as we only need the user id info
		dispatch({ type: FETCH_USER, payload: res.data });
};


// create a new action creator that returns an async function 
export const handleToken = token => 
	async dispatch => {
		// make a post request to the backend server
		// pass back 'token'
		// if this line completes, then it means we made a post request to the 
		// backend server
		const res = await axios.post('/api/stripe', token);
		// what type of action to dispatch
		// dispatch an action with 'FETCH_USER' and it contains a payload of 
		// the user model, the auth reducer will automatically pick it up.
		// then in theory anything in our app that depends on the user model 
		// will be automatically updated. 
		dispatch({ type: FETCH_USER, payload: res.data });
};

