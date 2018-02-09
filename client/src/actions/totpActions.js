import axios from 'axios';
import { FETCH_TOTP, FETCH_OTP } from './types';

export const fetchTotp = () => async dispatch => {
	const res = await axios.get('/auth/setup')
	// console.log("res", res);
	// console.log("res.data", res.data);

	dispatch({ type: FETCH_TOTP, payload: res.data });
};


export const fetchOtp = (data) => async dispatch => {
	console.log('**** totpActions POST - data', data);
	const res = await axios.post('/auth/login-otp', data)
	
	console.log('**** totpActions POST - res', res);
	// console.log('**** totpActions POST - res.data', res.data);

	dispatch({ type: FETCH_OTP, payload: res.data });
};

