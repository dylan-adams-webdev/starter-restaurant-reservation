import React, {useState} from 'react';
import { useHistory } from 'react-router';
import ReservationForm from './ReservationForm';
import ErrorAlert from '../error/ErrorAlert';
import {newReservation} from '../utils/api';

export default function CreateReservation() {
	const [error, setError] = useState(null);
	const history = useHistory();
	const submitHandler = (data) => {
		const abort = new AbortController();
		newReservation(data, abort.signal)
			.then(() => history.push(`/dashboard?date=${data.reservation_date}`))
			.catch(setError);
		return () => abort.abort();
	}
	
	return (
		<>
			<ErrorAlert error={error} />
			<ReservationForm submitHandler={submitHandler} />
		</>
	);
}
