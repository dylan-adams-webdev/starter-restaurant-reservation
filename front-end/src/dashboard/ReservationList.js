import React from 'react';
import ReservationCard from './ReservationCard';

export default function ReservationList({reservations}) {
	const content = reservations.map((res) => (
		<ReservationCard key={res.reservation_id} res={res} />
	));
	return <div>ReservationList</div>;
}
