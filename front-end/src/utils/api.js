const axios = require('axios');

const API_BASE_URL =
	process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const list = async (url, signal, params) => {
	const { data } = await axios.get(url, { signal, params }).catch((err) => {
		return new Error(err.response.data?.error);
	});
	return data;
};

const create = async (url, data) => {
	const res = await axios.post(url, { data }).catch((err) => {
		throw new Error(err.response.data.error);
	});
	return res.data;
};

export const listReservations = (signal, params = {}) => {
	const url = `${API_BASE_URL}/reservations/`;
	return list(url, signal, params);
};

export const listTables = (signal, params = {}) => {
	const url = `${API_BASE_URL}/tables/`;
	return list(url, signal, params);
};

export const newReservation = (body) => {
	const url = `${API_BASE_URL}/reservations/`;
	return create(url, body);
};

export const seatReservation = ({ reservation_id, table_id }) => {
	const url = `${API_BASE_URL}/tables/${table_id}/seat/`;
	return axios.put(url, { data: { reservation_id } }).catch((err) => {
		throw new Error(err.response.data.error);
	});
};

export const newTable = (body) => {
	const url = `${API_BASE_URL}/tables/`;
	return create(url, body);
};

export const finishTable = (table_id) => {
	const url = `${API_BASE_URL}/tables/${table_id}/seat`;
	return axios.delete(url, { data: { table_id } }).catch((err) => {
		throw new Error(err.response.data.error);
	});
};

export const updateStatus = ({ reservation_id, status }) => {
	const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
	return axios.put(url, { data: { status } }).catch((err) => {
		throw new Error(err.response.data.error);
	});
};

export const listReservationsByPhone = ({ signal, phone }) => {
	const url = `${API_BASE_URL}/reservations/`;
	const params = new URLSearchParams();
	params.append('mobile_number', phone);
	return list(url, signal, params);
};

export const cancelReservation = ({ reservation_id }) => {
	const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
	const body = { status: 'cancelled' };
	return axios
		.put(url, { data: body })
		.catch((err) => {
			throw new Error(err.response.data.error);
		});
};

export const editReservation = ({ data }) => {
	const url = `${API_BASE_URL}/reservations/${data.reservation_id}`;
	return axios.put(url, { data }).catch((err) => {
		throw new Error(err.response?.data.error);
	});
};
