import React, { useRef } from 'react';
import { useParams, useHistory } from 'react-router';
import { listTables, seatReservation } from '../utils/api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';

export default function Seat() {
	const { reservation_id } = useParams();
	const history = useHistory();

	const abort = new AbortController();
	const client = useQueryClient();
	const tables = useQuery('tables', () => listTables(abort.signal));
	const seat = useMutation(seatReservation, {
		onError: toast.error,
		onSuccess: () => {
			history.push('/dashboard')
			toast.success('Seated!')
},
		onSettled: () => client.invalidateQueries(['reservations', 'tables'])
	});

	const submitHandler = (event) => {
		event.preventDefault();
		seat.mutate({ reservation_id, table_id: event.target.table_id.value })
	};
	
	const cancelHandler = () => {
		history.goBack();
	}

	if (tables.isLoading) return '...loading';


	const options = tables.data.data.map((table) => {
		if(!table.reservation_id) return (
			<option key={table.table_id} value={table.table_id}>
				{table.table_name} - {table.capacity}
			</option>
		);
	});

	return (
		<>
			<h1>Seat Guests</h1>
			<form onSubmit={submitHandler}>
				<select
					className='form-select w-25'
					name='table_id'
					required
				>
					<option value=''>Select a table...</option>
					{options}
				</select>
				<div className='d-flex mt-2'>
					<button type='submit' className='btn btn-primary me-2'>
						Submit
					</button>
					<button type='button' className='btn btn-secondary' onClick={cancelHandler}>
						Cancel
					</button>
				</div>
			</form>
		</>
	);
}
