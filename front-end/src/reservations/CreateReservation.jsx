import React, { useState } from 'react';
import { useHistory } from 'react-router';
import ReservationForm from '../common/ReservationForm';
import ErrorAlert from '../error/ErrorAlert';
import { newReservation } from '../utils/api';
import { DateTime as dt, Duration, Interval } from 'luxon';
import { useMutation, useQueryClient } from 'react-query';

export default function CreateReservation() {
	const queryClient = useQueryClient();
	const { mutate, isLoading, error } = useMutation(newReservation, {
		onSuccess: (data) => {
			console.log(data.data.reservation_date);
			history.push({
				pathname: '/dashboard',
				search: `?date=${data.data.reservation_date}`,
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries('reservations');
		},
	});

	const [validationError, setValidationError] = useState(null);

	const history = useHistory();

	const submitHandler = (data) => {
		data = { ...data, status: 'booked' };
		console.log(data);
		if (validationError) setValidationError(null);
		if (!reservationDateTimeIsValid(data)) {
			setValidationError(
				new Error(
					'Reservation must be set during open hours on future date'
				)
			);
		} else {
			console.log(data);
			mutate(data);
		}
	};

	const reservationDateTimeIsValid = (data) => {
		const { reservation_date, reservation_time } = data;
		const dateTime = toDateTime(reservation_date, reservation_time);
		const orderTimeFrame = Interval.fromDateTimes(
			dateTime.set({ hour: 9, minute: 30 }),
			dateTime.set({ hour: 21, minute: 30 })
		);
		if (
			dateTime.weekday === 2 ||
			dateTime < dt.now() ||
			!orderTimeFrame.contains(dateTime)
		) {
			return false;
		} else return true;
	};

	const toDateTime = (date, time) => {
		const dateObj = dt.fromISO(date);
		return dateObj.plus(Duration.fromISOTime(time));
	};

	if (isLoading) return '...loading';
	return (
		<>
			<h1>Create Reservation</h1>
			<ErrorAlert error={validationError || error} />
			<ReservationForm submitHandler={submitHandler} />
		</>
	);
}
