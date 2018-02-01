// create a functional component

import React from 'react';
// import * as actions from '../actions';


const Setup = (qrImage) => {
	return (
		// to center text on screen using jsx add an object to style
		// 1st bracket indicates we're passing in js, the 2nd bracket
		// is the actual object we're passing in
		<div style={{ textAlign: 'center' }}>
			<h1>
				Setup
			</h1>
			<h4>Scan QR code with Google Authenticator.</h4>
				<img src='qrImage' alt='QR code' />
			<h4>Or enter the code below.</h4>

			<button>
				<a href="/login-otp">Click the "Next" button to complete setup.</a>
			</button>
		</div>
	);
};

export default Setup;
