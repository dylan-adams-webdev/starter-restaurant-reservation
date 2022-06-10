import React, { useEffect, useState } from 'react';
import { DateTime as dt } from 'luxon';
import { useHistory } from 'react-router';
import { listReservations, listTables } from '../utils/api';
import ErrorAlert from '../error/ErrorAlert';
import DateButtonGroup from './DateButtonGroup';
import ReservationList from '../common/ReservationList';
import TableList from './TableList';
import { useQuery } from 'react-query';

export default function Dashboard() {
	const hx = useHistory();
	const { search } = hx.location;
	const queryParam = new URLSearchParams(search).get('date');
	const initialDate = queryParam || dt.now().toISODate();

	const [dateString, setDateString] = useState(initialDate);

	const reservations = useQuery('reservations', listReservations);
	const tables = useQuery('tables', listTables);

	useEffect(updateSearchQuery, [dateString, hx]);

	function updateSearchQuery() {
		hx.push({ pathname: '/dashboard', search: `?date=${dateString}` });
	}

	function nextOrPreviousDate(value) {
		if (!value) {
			const now = dt.now().toISODate();
			return setDateString(now);
		}
		const newDateString = dt
			.fromISO(dateString)
			.plus({ days: value })
			.toISODate();
		setDateString(newDateString);
	}

	if (reservations.isLoading || tables.isLoading) return '...loading';

	const reservationViewDate =
		dateString === dt.now().toISODate()
			? 'today'
			: dt.fromISO(dateString).toLocaleString(dt.DATE_HUGE);

	const reservationList =
		(!reservations.error &&
			reservations.data.filter((res) => {
				const date = dt.fromISO(dateString);
				const isSameDate = dt
					.fromISO(res.reservation_date)
					.toLocal()
					.hasSame(date, 'day');
				const isNotFinished = res.status !== 'finished';
				return isNotFinished && isSameDate;
			})) ||
		null;

	const tableList = (!tables.error && tables.data) || null;

	return (
		<main>
			<ErrorAlert error={reservations.error} />
			<h1>Dashboard</h1>
			<div className='d-md-flex mb-3'>
				<h4 className='mb-0'>Reservations for {reservationViewDate}</h4>
			</div>
			<DateButtonGroup nav={nextOrPreviousDate} />
			<div className='row mt-3'>
				<div className='col-md-9'>
					<ReservationList
						reservations={reservationList}
						onEmpty={'No reservations found'}
					/>
				</div>
				<div className='col-md-3'>
					<TableList tables={tableList} />
				</div>
			</div>
		</main>
	);
}
