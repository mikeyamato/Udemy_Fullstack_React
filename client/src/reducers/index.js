// 'index.js' file allows us to import the 'reducers' directory. which
// by convention with import statements will automatically give us 
// any file in that directory with the name 'index.js' 

// import 'authReducer' and combine it with a 'combineReducers' call
// thanks to the redux library and immediately export it from this file.

import { combineReducers } from 'redux';
import authReducer from './authReducer';

// place our 'combineReducers' call and immediately export it
export default combineReducers({
	// wire up the 'authReducers' inside here
	// what ever keys we provide to this object are going to represent the
	// keys that exist inside our state object. so be sure to give some thought
	// to the naming convention

	// the 'auth' piece of state is being manufactured/produced by the 
	// 'authReducer'  
	auth: authReducer
});
