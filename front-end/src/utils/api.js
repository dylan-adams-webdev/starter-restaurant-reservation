const axios = require('axios');

const API_BASE_URL =
	process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const listReservations = async (params, signal) => {
	console.log({params, signal});
	const url = `${API_BASE_URL}/reservations`;
	const {data} = await axios.get(url, { params, signal });
	return data;
};
