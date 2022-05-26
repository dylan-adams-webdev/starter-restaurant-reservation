import React, { useState } from 'react';
import { useHistory } from 'react-router';
import ReservationForm from './ReservationForm';
import ErrorAlert from '../error/ErrorAlert';
import { newReservation } from '../utils/api';
import { DateTime as dt, Duration } from 'luxon';

export default function CreateReservation() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const history = useHistory();
	const submitHandler = (data) => {
		if (!reservationDateTimeIsValid(data)) {
			setError(
				new Error('The reservation must be set for a future date')
			);
		} else {
			setIsLoading(true);
			const abort = new AbortController();
			newReservation(data, abort.signal)
				.then(() =>
					history.push(`/dashboard?date=${data.reservation_date}`)
				)
				.catch(setError);
			return () => abort.abort();
		}
	};

	const reservationDateTimeIsValid = (data) => {
		const { reservation_date, reservation_time } = data;
		const dateObj = dt.fromISO(reservation_date);
		const timeObj = Duration.fromISOTime(reservation_time);
		const dateTimeObj = dateObj.plus(timeObj);
		if (dateObj.weekday === 2 || dateTimeObj < dt.now()) return false;
		return true;
	};

	if (isLoading) return '...loading';
	return (
		<>
			<ErrorAlert error={error} />
			<ReservationForm submitHandler={submitHandler} />
		</>
	);
}
