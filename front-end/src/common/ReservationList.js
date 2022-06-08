import React from 'react';
import ReservationCard from './ReservationCard';

export default function ReservationList({ reservations, onEmpty }) {
	if (!reservations?.length) return <span>{onEmpty}</span>;

	const content = reservations.map((res) => {
		<ReservationCard key={res.reservation_id} res={res} />;
	});

	return <div className='row'>{content}</div>;
}
