import axios from 'axios';
import { FETCH_USER } from './types';



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

