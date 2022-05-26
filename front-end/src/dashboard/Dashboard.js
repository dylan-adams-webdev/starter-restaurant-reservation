import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { listReservations } from '../utils/api';
import ErrorAlert from '../error/ErrorAlert';
import ReservationCard from './ReservationCard';
import DateButtonGroup from './DateButtonGroup';
import { DateTime as dt } from 'luxon';

/**
 * Defines the dashboard page.
 * @returns {JSX.Element}
 */
export default function Dashboard() {
const hx = useHistory();
	const { search } = hx.location;
	const queryParam = new URLSearchParams(search).get('date');
	const initialDate = queryParam || dt.now().toISODate();

	const [reservations, setReservations] = useState([]);
	const [reservationsError, setReservationsError] = useState(null);
	const [dateString, setDateString] = useState(initialDate);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(loadDashboardData, [dateString]);
	useEffect(updateSearchQuery, [dateString, hx]);

	function loadDashboardData() {
		setIsLoading(true);
		const abortController = new AbortController();
		setReservationsError(null);
		listReservations({ date: dateString }, abortController.signal)
			.then(setReservations)
			.then(() => setIsLoading(false))
			.catch(setReservationsError);
		return () => abortController.abort();
	}

	function updateSearchQuery() {
		hx.push({ pathname: '/dashboard', search: `?date=${dateString}` });
	}

	function nextOrPreviousDate(value) {
		const newDateString = dt
			.fromISO(dateString)
			.plus({ days: value })
			.toISODate();
		setDateString(newDateString);
	}

	function today() {
		const today = dt.now().toISODate();
		setDateString(today);
	}

	const content = reservations.map((res) => (
		<ReservationCard key={res.reservation_id} res={res} />
	));

	const reservationViewDate = dt.fromISO(dateString).hasSame(dt.now(), 'day')
		? 'today'
		: dt.fromISO(dateString).toLocaleString(dt.DATE_HUGE);

	return (
		<main>
			<ErrorAlert error={reservationsError} />
			<h1>Dashboard</h1>
			<div className='d-md-flex mb-3'>
				<h4 className='mb-0'>Reservations for {reservationViewDate}</h4>
			</div>
			<DateButtonGroup nav={nextOrPreviousDate} today={today} />
			<div className='row row-cols-1 row-cols-md-4 g-4 mt-2'>
				{isLoading && !reservationsError
					? '...loading'
					: (content.length && content) || 'no reservations'}
			</div>
		</main>
	);
}
