import axios from 'axios';
import { FETCH_TOTP } from './types';

export const fetchTotp = () =>
	async dispatch => {
		const res = await axios.get('/auth/setup')
		console.log("res", res);
		console.log("res.data", res.data);
		// 'res' is the output from 'axios.get('/api/current_user')'
		// it represent the request made to the backend server
		// update from 'res' to 'res.data' as we only need the user id info
		dispatch({ type: FETCH_TOTP, payload: res.data });
};