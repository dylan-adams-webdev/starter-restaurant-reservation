import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router';
import ErrorAlert from '../error/ErrorAlert';
import ReservationForm from '../common/ReservationForm';
import { editReservation, listReservations } from '../utils/api';
import { DateTime as dt, Duration, Interval } from 'luxon';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export default function EditReservation() {
	const resId = useParams().reservation_id;
	const queryClient = useQueryClient();
	const abort = new AbortController();
	const reservations = useQuery('reservations', () =>
		listReservations(abort.signal)
	);
	const { mutate, isLoading, error } = useMutation(editReservation, {
		onSuccess: (data) => {
			const date = data.data.data.reservation_date;
			history.push({
				pathname: '/dashboard',
				search: `?date=${dt.fromISO(date).toISODate()}`,
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries('reservations');
		},
	});

	const [validationError, setValidationError] = useState(null);

	const history = useHistory();

	const submitHandler = (data) => {
		if (validationError) setValidationError(null);
		if (!reservationDateTimeIsValid(data)) {
			setValidationError(
				new Error(
					'Reservation must be set during open hours on future date'
				)
			);
		} else {
			mutate({ data });
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

	if (isLoading || reservations.isLoading) return '...loading';

	const reservation = reservations.data.data.find(
		(res) => res.reservation_id === Number(resId)
	);

	return (
		<>
			<h1>Edit Reservation</h1>
			<ErrorAlert error={validationError || error} />
			<ReservationForm
				submitHandler={submitHandler}
				initialState={reservation}
			/>
		</>
	);
}
