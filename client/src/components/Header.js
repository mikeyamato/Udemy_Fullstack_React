// create a class based component
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Payments from './Payments';

// we are making a 'class' based component because we expect to place
// a helper or function in here that is responsible for what to render
// in the 'Header' component
class Header extends Component {
	// create helper method called 'rendercontent'
	renderContent() {
		// inpsect 'this.props.auth' property and depending on it's value
		// return some blob of jsx to show within <ul>.
		// this is a good place to add a switch statement since 
		// 'this.props.auth' can be 1 of 3 statements.
		// 'this.props.auth' tells us if we are signed into the app or not.
		switch (this.props.auth) {
			// thinking
			case null:
				// leave blank because i don't want to show anything at all 
				// while it's trying to login 
				return;
			// not logged in
			case false:
				// include a link to log in
				return <li><a href="/auth/google">Login with Google</a></li>;
			// logged out
			default:
				return [
					// cleaned this up a bit to include the Payments component
					// add a 'key'. it must be unique and consistent across renders. 
					// since the key really doesn't change it can be anything. 
					<li key='1'><Payments /></li>,
					<li key='3' style={{ margin: '0 10px' }}>
						Credits: {this.props.auth.credits}
					</li>,
					<li key='2'><a href="/api/logout">Log out</a></li>,
					<li key='4'><a href="/setup">Setup 2FA</a></li>,
					<li key='5'><a href="/login-otp">Login OTP</a></li>,
					<li key='6'><a href="/account">2FA Account</a></li>
				];
		}
	}
	
	// define our render method
	render() {
		return (
			<nav>
				<div className='nav-wrapper'>
					{/* add a 'link' tag to allow for either going back to the root */}
					{/* if not signed in or another page if they are signed in */}
					{/* if 'this.props.auth' exists (signed in) then go to 'surveys' */}
					<Link 
						to={this.props.auth ? '/surveys' : '/'} 
						className='left brand-logo'
					>
						Emaily
					</Link>
					{/* we'll place a 'ul' as a sibling to the anchor tag */}
					{/* these will form the right hand elements of the screen */}
					<ul className='right'>
						{/* use jsx to show what situation we are in based on the above statement */}
						{/* there used to be <li> here */}
						{this.renderContent()}
					</ul>
				</div>
			</nav>
		);
	}
}

// 'mapStateToProps' gets called with the entire state object from the redux store.
function mapStateToProps({auth}){
	// return an object that will be passed to the header as props
	// to visually see if we are logged in or not we want to take advantage of 'auth' within
	// 'reducers' > 'index.js'
	return { auth };
};

// be sure to pass 'mapStateToProps' as an argument for 'connect'
export default connect(mapStateToProps)(Header);
