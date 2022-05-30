import React, { useState } from 'react';
import { useHistory } from 'react-router';
import ErrorAlert from '../error/ErrorAlert';
// import { newTable } from '../utils/api';
import TableForm from './TableForm';

export default function CreateTable() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const hx = useHistory();

	// const submitHandler = (data) => {
	// 	setIsLoading(true);
	// 	data.capacity = Number(data.capacity);
	// 	const abort = new AbortController();
	// 	newTable(data, abort.signal)
	// 		.then(() => hx.push('/dashboard'))
	// 		.catch(err => {
	// 			setIsLoading(false);
	// 			setError(err);
	// 		});
	// };

	if (isLoading) return '...loading';
	return (
		<>
			<ErrorAlert error={error} />
			<h1>Create Table</h1>
			<TableForm />
		</>
	);
}
