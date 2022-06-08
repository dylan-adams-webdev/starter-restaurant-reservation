import React, { useState } from 'react';
import { useQuery } from 'react-query';
import ReservationList from '../common/ReservationList';
import { listReservations } from '../utils/api';

export default function Search() {
	const initialState = { mobile_number: '' };

	const [formData, setFormData] = useState(initialState);
	const [matchingReservatins, setMatchingReservations] = useState([]);

	const abort = new AbortController();

	const query = useQuery('reservations', () =>
		listReservations(abort.signal)
	);

	const submitHandler = (event) => {
		event.preventDefault();
		const match = query.data.data.filter((res) => {
			const a = res.mobile_number.replace(/\D/g, '');
			const b = formData.mobile_number.replace(/\D/g, '');
			return b.includes(a);
		});
		setMatchingReservations(match);
	};

	const changeHandler = ({ target }) => {
		setFormData({ ...formData, [target.name]: target.value });
	};

	return (
		<>
			<form onSubmit={submitHandler}>
				<div className='d-flex'>
					<input
						type='text'
						id='mobile_number'
						name='mobile_number'
						placeholder={"Enter a customer's phone number"}
						onChange={changeHandler}
						className='form-control w-25 d-inline'
					/>
					<button type='submit' className='btn btn-primary ms-2'>
						Find
					</button>
				</div>
			</form>
			<ReservationList
				reservations={matchingReservatins}
				onEmpty={'No reservations found'}
			/>
		</>
	);
}
