import React from 'react';
import ReservationForm from './ReservationForm';

export default function CreateReservation() {
	const submitHandler = (data) => {
		console.log(data);
	}
	
	return (
		<>
			<ReservationForm submitHandler={submitHandler} />
		</>
	);
}
