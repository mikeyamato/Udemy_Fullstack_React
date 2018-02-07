// on the frontend we are using webpack and babel which 
// give us access to es2015 modules. therefore we need
// to import. on the backend we use node.js which support
// commonJS right now. commonJS uses 'require' instead
import React, { Component } from 'react';
// import 2 helpers from the 'react-router-dom' library.
// 1st is an object called 'BrowserRouter'. this can be 
// thought of as the brains of react-router...how to behave.
// 2nd is an object called 'Route'. sets a rule between a 
// certain route and a set of components visible on the 
// screen. 
import { BrowserRouter, Route } from 'react-router-dom';
// react-redux is all about compatibility between react and 
// redux libary. redux was built with the intent of not 
// being used with react. we'll take advantage of the 'connect'
// function to give certain components the ability to call 
// action creators. 
import { connect } from 'react-redux';
// import all the different action creators and assign them 
// to the object. as of now there's only 1 but over time there 
// will be many. 
import * as actions from '../actions';

// create dummy component just to get the structure started
// these are going to be a functional components. these
// will get replaced later down the line with real ones. 
// make sure import statements are at the top of the file
import Header from './Header';
import Landing from './Landing';
import Account from './Account';
import Setup from './Setup';
import LoginOTP from './loginOtp/LoginOtpR1';
// import LoginOTP from './loginOtp/LoginOtp';



// the following are dummy components
const Dashboard = () => <h2>Dashboard</h2>
const SurveyNew = () => <h2>SurveyNew</h2>


// refactor to be class based
class App extends Component {
// create the App component. a functional component
// const App = () => {
	// add on our lifecyle method that will be used to fetch the 
	// current user.
	// the instant the component is mounted/rendered onto the screen
	// go fetch the current user or figure out if the current user
	// is signed in
	componentDidMount() {
		this.props.fetchUser();
	}
	// keep the same return block/statement but wrap it in a render 
	// function
	render() {
		return (
			// jsx below
			// since materialize.js assumes we have a container we'll add 
			// a container here
			<div className='container'>
				{/* add 'browserRouter' component */}
				<BrowserRouter>
					{/* 'BrowserRouter expects to have AT MOST 1 child */}
					<div>
						{/* add a collection of different routes */}
						{/* 1st route will be for the 'Landing' component */}
						{/* pass in a prop of 'path' and 'component'*/}
						{/* '/' just means the root route. so whenever*/}
						{/* someone goes to the root route, show the landing */}
						{/* component. to deal with showing the exact route */}
						{/* add in `exact={true}`. it will still work with just */}
						{/* `exact` */}
						{/* to show a component at all times like 'Header' just */}
						{/* drop it in without any restrictions */}
						<Header />
						<Route exact={true} path='/' component={Landing} />
						{/* add the 'Dashboard' component. place this under the*/}
						{/* previous 'Route' */}
						<Route exact path='/surveys' component={Dashboard} />
						<Route exact path='/surveys/new' component={SurveyNew} />
						<Route exact path='/login-otp' component={LoginOTP} />
						<Route exact path='/setup' component={Setup} />
						<Route exact path='/account' component={Account} />
					</div>
				</BrowserRouter>
			</div>
		);
	}
};



// export component
// apply the connect function. first argument is reservered for the map
// state to props argument or the map state to props function (we will not
// be using for this component). 2nd argument we'll pass in all the different
// action creators we want to wire up 
// once we pass in all the different actions they're assigned to the 'App'
// component as props. so now inside our 'App' component we can call our 
// action creator 'this.props.<name of action creator>'...'this.props.fetchUser'
// 'src' > 'actions' > 'index.js'. applied right below 'componentDidMount()'
export default connect(null, actions)(App);