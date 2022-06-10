import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router';
import { listTables, seatReservation, listReservations } from '../utils/api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-hot-toast';
import ErrorAlert from '../error/ErrorAlert';

export default function Seat() {
	const { reservation_id } = useParams();
	const history = useHistory();

	const [error, setError] = useState(null);

	const client = useQueryClient();
	const tables = useQuery('tables', listTables);
	const reservations = useQuery('reservations', listReservations);
	const seat = useMutation(seatReservation, {
		onError: toast.error,
		onSuccess: () => {
			history.push('/dashboard');
			toast.success('Seated!');
		},
		onSettled: () => client.invalidateQueries(['reservations', 'tables']),
	});

	if (tables.isLoading || reservations.isLoading) return '...loading';

	const reservation = reservations.data.find(
		(res) => res.reservation_id === Number(reservation_id)
	);

	const submitHandler = (event) => {
		event.preventDefault();
		const t = event.target.table_id.value;
		const table = tables.data.find((table) => table.table_id === Number(t));
		if (table.reservation_id) {
			setError(new Error('table is already occupied'));
		} else if(reservation.people > table.capacity) {
			setError(new Error('table does not have sufficient capacity'));
		} else {
			seat.mutate({
				reservation_id,
				table_id: Number(t),
			});
		}
		
	};

	const cancelHandler = () => {
		history.goBack();
	};

	const options = tables.data.map((table) => {
		if (!table.reservation_id)
			return (
				<option key={table.table_id} value={table.table_id}>
					{table.table_name} - {table.capacity}
				</option>
			);
		return null;
	});

	return (
		<>
			<ErrorAlert error={error} />
			<h1>Seat Guests</h1>
			<form onSubmit={submitHandler}>
				<select className='form-select w-25' name='table_id' required>
					<option value=''>Select a table...</option>
					{options}
				</select>
				<div className='d-flex mt-2'>
					<button type='submit' className='btn btn-primary me-2'>
						Submit
					</button>
					<button
						type='button'
						className='btn btn-secondary'
						onClick={cancelHandler}
					>
						Cancel
					</button>
				</div>
			</form>
		</>
	);
}
