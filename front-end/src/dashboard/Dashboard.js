import React, { useEffect, useState } from 'react';
import { DateTime as dt } from 'luxon';
import { useHistory } from 'react-router';
import { listReservations, listTables } from '../utils/api';
import ErrorAlert from '../error/ErrorAlert';
import DateButtonGroup from './DateButtonGroup';
import ReservationList from './ReservationList';
import TableList from './TableList';

/**
 * Defines the dashboard page.
 * @returns {JSX.Element}
 */
export default function Dashboard() {
	const hx = useHistory();
	const { search } = hx.location;
	const queryParam = new URLSearchParams(search).get('date');
	const initialDate = queryParam || dt.now().toISODate();

	const [dateString, setDateString] = useState(initialDate);
	const [reservations, setReservations] = useState(null);
	const [tables, setTables] = useState(null);
	const [reservationError, setReservationError] = useState(null);
	const [tableError, setTableError] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(updateSearchQuery, [dateString, hx]);

	useEffect(loadReservations, [dateString]);
	
	useEffect(loadTables, []);

	function loadReservations() {
		const abortController = new AbortController();
		setError(n)
		listReservations({ date: dateString }, abortController.signal)
			.then(setReservations)
			.catch((err) => {
				abortController.abort();
				setError(err);
			});
		return () => abortController.abort();
	}
	
	function loadTables() {
		const abortController = new AbortController();
		
	}

	function updateSearchQuery() {
		hx.push({ pathname: '/dashboard', search: `?date=${dateString}` });
	}

	/**
	 * Change the date of reservations to be displayed
	 * @param value -1 for prev, 0 for today, 1 for next
	 */
	function nextOrPreviousDate(value) {
		const newDateString = dt
			.fromISO(dateString)
			.plus({ days: value })
			.toISODate();
		setDateString(newDateString);
	}

	const reservationViewDate = dt.fromISO(dateString).hasSame(dt.now(), 'day')
		? 'today'
		: dt.fromISO(dateString).toLocaleString(dt.DATE_HUGE);

	if (isLoading) return '...loading';
	return (
		<main>
			<ErrorAlert error={error} />
			<h1>Dashboard</h1>
			<div className='d-md-flex mb-3'>
				<h4 className='mb-0'>Reservations for {reservationViewDate}</h4>
			</div>
			<DateButtonGroup nav={nextOrPreviousDate} />
			<ReservationList reservations={reservations} />
			<TableList tables={tables} />
		</main>
	);
}
