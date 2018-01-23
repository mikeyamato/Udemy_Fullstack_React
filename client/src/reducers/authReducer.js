// titled begining with a lowercase 'a' because we will be exporting
// a function from this file

// we'll create a reducer and immediately export it

// import an action type then be sure to add a case statement below within 'switch'
import { FETCH_USER } from '../actions/types';


// function will be called with 2 arguments. 1st is 'state' object. this
// is responsible for this reducer. 2nd is an 'action' object
// since the 'state' object starts off as undefined so we'll need to pass some 
// initial state for it. we'll say the initial state is an empty object but 
// later switch this to 'null' as one of the 3 situations (null, user model, false)
export default function (state = null, action) {
	// log all actions that the reducer gets called with
	console.log("sup", action);

	
	// we'll 'switch' over the action type. currently none are defined in 
	// our app. therefore we'll assume we'll have a single case, a default
	// case where we'll just return our state.
	switch (action.type) {
		// add a case statement after importing
		case FETCH_USER:
			// if we see an action with 'FETCH_USER' we want to do this
			// 'action.payload' is the user model = logged in
			// 'false' because we don't want to return an empty string in the data
			return action.payload || false;
		default:
			// no change to state is necessary so just return the 'state' object
			return state
	}
}

