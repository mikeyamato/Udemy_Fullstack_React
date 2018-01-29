import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import * as actions from '../actions';

class Payments extends Component {
	render () {
		// add a debugger to see the actual js code of how REACT_APP_STRIPE_KEY
		// returns. 
		return (
			<StripeCheckout 
				// amount of money we're going to request from the user
				// we need to let stripe know what currency to work in 
				// default is usd 
				// everything is in cents so $5 is 500 cents 
				amount={500}
				// not the api token. this is the callback token once we  
				// get the authorized token from stripe 
				// this is pulled from 'actions'>'index.js'
				// we need to call the action creator with the token as the 
				// argument
				token={token => this.props.handleToken(token)}
				// api key
				stripeKey={process.env.REACT_APP_STRIPE_KEY}
				// header at the top of the modal 
				name='Emaily'
				// description of what the payment is for
				description='$5 for 5 email credits'
			>
				<button className='btn'>
					Add Credit
				</button>
			</StripeCheckout>
		);
	}
}

// action creator is the 2nd argument and that's all we care about,
// 'actions'
export default connect(null, actions)(Payments); 

