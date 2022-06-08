import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import ReservationList from '../common/ReservationList';
import { listReservationsByPhone } from '../utils/api';

export default function Search() {
	const initialState = { mobile_number: '' };

	const [formData, setFormData] = useState(initialState);

	const abort = new AbortController();

	const client = useQueryClient();
	const query = useMutation(listReservationsByPhone, {
		onError: toast.error,
		onSettled: () => client.invalidateQueries('reservations')
});

	const submitHandler = (event) => {
		query.mutate({
			signal: abort.signal,
			phone: formData.mobile_number,
		});
	};

	const changeHandler = ({ target }) => {
		setFormData({ ...formData, [target.name]: target.value });
	};
	
	if (query.isLoading) return '...loading';

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
				reservations={query.data?.data}
				onEmpty={'No reservations found'}
			/>
		</>
	);
}
