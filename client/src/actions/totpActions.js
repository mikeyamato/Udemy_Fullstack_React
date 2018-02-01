import axios from 'axios';
import { FETCH_USER } from './types';

export const fetchUser = () =>
	async dispatch => {
		const res = await axios.get('/api/current_user')
		// 'res' is the output from 'axios.get('/api/current_user')'
		// it represent the request made to the backend server
		// update from 'res' to 'res.data' as we only need the user id info
		dispatch({ type: FETCH_USER, payload: res.data });
};