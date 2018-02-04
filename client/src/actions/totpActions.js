import axios from 'axios';
import { FETCH_TOTP } from './types';

export const fetchTotp = () => async dispatch => {
	const res = await axios.get('/auth/setup')
	// console.log("res", res);
	// console.log("res.data", res.data);

	dispatch({ type: FETCH_TOTP, payload: res.data });
};

/*
export const fetchOtp = () => async dispatch => {
	const res = await axios.post('/auth/setup')
	// console.log("res", res);
	// console.log("res.data", res.data);

	dispatch({ type: FETCH_TOTP, payload: res.data });
};
*/
