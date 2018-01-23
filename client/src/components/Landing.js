// create a functional component

import React from 'react';

const Landing = () => {
	return (
		// to center text on screen using jsx add an object to style
		// 1st bracket indicates we're passing in js, the 2nd bracket
		// is the actual object we're passing in
		<div style={{ textAlign: 'center' }}>
			<h1>
				Emaily!
			</h1>
			Collect feedback from your users.
		</div>
	);
};

export default Landing;
