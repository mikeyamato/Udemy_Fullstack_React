// import in css file from materialize
// no relative path is include because whenver webpack parses and import
// statement path like 'materialize-css' webpack automatically assumes
// we are trying to specify an npm module (inside 'node_modules').
// whenever we import a css file it doesn't assign a variable in the js 
// world. so the variable 'materializeCSS' we don't need at all. this
// means we can clean this up a bit and import the path.  
import 'materialize-css/dist/css/materialize.min.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import App from './components/App';
// import the reducers from the reducers directory and pass that as 
// the 1st argument to 'createStore'
import reducers from './reducers';

// use 'createStore' helper to create a new instance of a redux store  
// first argument are all the reducers inside our app. since we don't 
// have a reducer yet we'll apply a dummy reducer, an arrow function
// that returns an array
// 2nd argument will be the starting or initial state of the app
// since we don't care about server side rendering we'll just pass 
// along an empty object
// 3rd, we'll apply middleware  
// pass 'reduxThunk' to 'applyMiddleware'
const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

// 'ReactDOM' takes 2 arguments. 1st is our root component ('App'), 2nd where we
// are trying to render the component to inside our DOM 
// use JSX tags inside the argument because 'ReactDOM.render' expects a 
// component instance which we create by using JSX tags. 
// for the 2nd argument we see inside 'public' > 'index.html' .this houses the 
// react side of the app. but inside the file there is a <div> with an id of 
// 'root'. this is where we'll render the application to. 
ReactDOM.render(
	// to the provider we'll pass the store we just created as a prop
	// as a child to the provider tag we'll pass the App component
	<Provider store={store}><App /></Provider>,
	document.querySelector('#root')
);

console.log('STRIPE KEY IS ', process.env.REACT_APP_STRIPE_KEY);
console.log('OUR ENVRONMENT IS ', process.env.NODE_ENV);
