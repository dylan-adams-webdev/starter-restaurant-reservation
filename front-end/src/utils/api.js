const API_BASE_URL =
	process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const fetchJson = async (url, options, body) => {
	const headers = { 'Content-Type': 'application/json' };
	console.log("BODY BEFORE", body);
	body = body ? JSON.stringify({ data: body }) : null;
	console.log("BODY AFTER:", body);
	try {
		const abort = new AbortController();
		const signal = abort.signal;
		const res = await fetch(url, {
			headers,
			signal,
			...options,
			body,
		});
		res.cancel = () => abort.abort();
		const { data } = await res.json();
		return data;
	} catch (err) {
		if (err.name !== 'AbortError') {
			console.error(err);
			throw new Error(err.message);
		}
		else console.log(err.name);
	} 
};

export const listReservations = () => {
	const url = `${API_BASE_URL}/reservations/`;
	const options = {
		method: 'GET',
	};
	return fetchJson(url, options);
};

export const listTables = () => {
	const url = `${API_BASE_URL}/tables/`;
	const options = {
		method: 'GET',
	};
	return fetchJson(url, options);
};

export const newReservation = (body) => {
	const url = `${API_BASE_URL}/reservations/`;
	const options = { method: 'POST' };
	return fetchJson(url, options, body);
};

// // abort controller not required for seat
// export const seatReservation = ({ reservation_id, table_id }) => {
// 	const url =
// 	return axios.put(url, { data: { reservation_id } }).catch((err) => {
// 		throw new Error(err.response.data.error);
// 	});
// };

export const seatReservation = ({ reservation_id, table_id }) => {
	const url = `${API_BASE_URL}/tables/${table_id}/seat/`;
	const options = {
		method: 'PUT',
	};
	return fetchJson(url, options, {reservation_id});
};

// export const newTable = ({ body }) => {
// 	const url = 
// 	return create(url, body);
// };

export const newTable = ({ table_name, capacity }) => {
	const url = `${API_BASE_URL}/tables/`;
	const options = {method: 'POST'}
	return fetchJson(url, options, {table_name, capacity})
}

// // abort controller not required for finish
// export const finishTable = (table_id) => {
// 	const url = 
// 	return axios.delete(url, { data: { table_id } }).catch((err) => {
// 		throw new Error(err.response.data.error);
// 	});
// };

export const finishTable = ({table_id}) => {
	const url = `${API_BASE_URL}/tables/${table_id}/seat`;
	const options = { method: 'DELETE' };
	return fetchJson(url, options, {table_id});
}

// export const updateStatus = ({ reservation_id, status }) => {
// 	const url = 
// 	return axios.put(url, { data: { status } }).catch((err) => {
// 		throw new Error(err.response.data.error);
// 	});
// };

export const updateStatus = ({ reservation_id, status }) => {
	const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
	const options = { method: 'PUT' };
	return fetchJson(url, options, { status });
}

// export const listReservationsByPhone = (phone) => {
// 	const url = 
// 	const params = new URLSearchParams();
// 	params.append('mobile_number', phone);
// 	return list(url, params);
// };

export const listReservationsByPhone = (phone) => {
	const url = new URL(`${API_BASE_URL}/reservations`);
	url.searchParams.append('mobile_number', phone);
	const options = { method: 'GET' };
	return fetchJson(url, options);
}

// // abort controller not required for cancel
// export const cancelReservation = ({ reservation_id }) => {
// 	const url = 
// 	const body = { status: 'cancelled' };
// 	return axios.put(url, { data: body }).catch((err) => {
// 		throw new Error(err.response.data.error);
// 	});
// };

export const cancelReservation = ({ reservation_id }) => {
	const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
	const options = { method: 'PUT' };
	return fetchJson(url, options, { status: 'cancelled' });
}

// export const editReservation = ({ data }) => {
// 	const url = `${API_BASE_URL}/reservations/${data.reservation_id}`;
// 	return axios.put(url, { data }).catch((err) => {
// 		throw new Error(err.response?.data.error);
// 	});
// };

export const editReservation = async ({ data }) => {
	const options = {
		method: 'PUT',
	};
	const url = `${API_BASE_URL}/reservations/${data.reservation_id}`;
	return await fetchJson(url, options, data);
};
