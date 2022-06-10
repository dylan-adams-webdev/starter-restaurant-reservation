const API_BASE_URL =
	process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const fetchJson = async (url, options, body) => {
	const headers = { 'Content-Type': 'application/json' };
	body = body ? JSON.stringify({ data: body }) : null;
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
		else console.error(err.name);
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

export const seatReservation = ({ reservation_id, table_id }) => {
	const url = `${API_BASE_URL}/tables/${table_id}/seat/`;
	const options = {
		method: 'PUT',
	};
	return fetchJson(url, options, {reservation_id});
};

export const newTable = ({ table_name, capacity }) => {
	const url = `${API_BASE_URL}/tables/`;
	const options = {method: 'POST'}
	return fetchJson(url, options, {table_name, capacity})
}

export const finishTable = ({table_id}) => {
	const url = `${API_BASE_URL}/tables/${table_id}/seat`;
	const options = { method: 'DELETE' };
	return fetchJson(url, options, {table_id});
}

export const updateStatus = ({ reservation_id, status }) => {
	const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
	const options = { method: 'PUT' };
	return fetchJson(url, options, { status });
}

export const listReservationsByPhone = (phone) => {
	const url = new URL(`${API_BASE_URL}/reservations`);
	url.searchParams.append('mobile_number', phone);
	const options = { method: 'GET' };
	return fetchJson(url, options);
}

export const cancelReservation = ({ reservation_id }) => {
	const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
	const options = { method: 'PUT' };
	return fetchJson(url, options, { status: 'cancelled' });
}

export const editReservation = async ({ data }) => {
	const options = {
		method: 'PUT',
	};
	const url = `${API_BASE_URL}/reservations/${data.reservation_id}`;
	return await fetchJson(url, options, data);
};
