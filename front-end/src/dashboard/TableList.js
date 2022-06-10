import React from 'react';
import { useQueryClient, useMutation } from 'react-query';
import { finishTable } from '../utils/api';
import { toast } from 'react-hot-toast';

export default function TableList({ tables }) {
	const queryClient = useQueryClient();
	const query = useMutation(finishTable, {
		onSuccess: () => toast.success('Table finished'),
		onError: (error) => toast.error(error.message),
		onSettled: () => {
			queryClient.invalidateQueries('tables');
			queryClient.invalidateQueries('reservations');
		},
	});

	const finish = (table_id) => {
		const confirm = window.confirm(
			'Is this table ready to seat new guests?\nThis cannot be undone.'
		);
		if (confirm) query.mutate({table_id});
	};

	if (tables === null) return null;
	if (!tables) return '...loading';
	if (!tables.length) return 'No tables found';

	const rows = tables.map((table) => {
		const status = table.reservation_id ? 'occupied' : 'free';
		return (
			<tr key={table.table_id}>
				<td>{table.table_name}</td>
				<td>
					<span
						className={`badge ${
							status === 'free' ? 'bg-success' : 'bg-danger'
						}`}
						data-table-id-status={table.table_id}
					>
						{status}
					</span>
				</td>
				<td>
					{table.reservation_id ? (
						<button
							type='button'
							className='btn btn-sm btn-outline-danger'
							data-table-id-finish={table.table_id}
							onClick={() => finish(table.table_id)}
						>
							Finish
						</button>
					) : (null)
					}
				</td>
			</tr>
		);
	});

	return (
		<table className='table'>
			<tbody>
				<tr>
					<th>Name</th>
					<th>Status</th>
					<th>Action</th>
				</tr>
				{rows}
			</tbody>
		</table>
	);
}
