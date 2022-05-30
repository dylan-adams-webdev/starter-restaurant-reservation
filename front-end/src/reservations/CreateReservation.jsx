import React, { useState } from 'react';
import { useHistory } from 'react-router';
import ReservationForm from './ReservationForm';
import ErrorAlert from '../error/ErrorAlert';
import { newReservation } from '../utils/api';
import { DateTime as dt, Duration, Interval } from 'luxon';

export default function CreateReservation() {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const history = useHistory();

	const submitHandler = (data) => {
		if (error) setError(false);
		if (!reservationDateTimeIsValid(data)) {
			setError(
				new Error(
					'Reservation must be set during open hours on future date'
				)
			);
		} else {
			setIsLoading(true);
			const abort = new AbortController();
			newReservation(data, abort.signal)
				.then(() =>
					history.push({
						pathname: '/dashboard',
						search: `?date=${data.reservation_date}`,
					})
				)
				.then(() => setIsLoading(false))
				.catch(setError)
				.then(setIsLoading(false));
			return () => abort.abort();
		}
	};

	const reservationDateTimeIsValid = (data) => {
		const { reservation_date, reservation_time } = data;
		const dateTime = toDateTime(reservation_date, reservation_time);
		const orderTimeFrame = new Interval(
			dateTime.set({ hour: 9, minute: 30 }),
			dateTime.set({ hour: 21, minute: 30 })
		);
		if (
			dateTime.weekday === 2 ||
			dateTime < dt.now() ||
			!orderTimeFrame.contains(dateTime)
		)
			return false;
		else return true;
	};

	const toDateTime = (date, time) => {
		const dateObj = dt.fromISO(date);
		const timeObj = Duration.fromISOTime(time);
		return dateObj.plus(timeObj);
	};

	if (isLoading) return '...loading';
	return (
		<>
			<h1>Create Reservation</h1>
			<ErrorAlert error={error} />
			<ReservationForm submitHandler={submitHandler} />
		</>
	);
}
