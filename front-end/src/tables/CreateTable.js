import { useQueryClient, useMutation } from 'react-query';
import { useHistory } from 'react-router';
import ErrorAlert from '../error/ErrorAlert';
import { newTable } from '../utils/api';
import TableForm from './TableForm';

export default function CreateTable() {
	const history = useHistory();
	const queryClient = useQueryClient();
	const query = useMutation(newTable, {
		onSuccess: () => {
			history.push('/dashboard')
		},
		onSettled: () => queryClient.invalidateQueries('tables'),
	})
	
	const submitHandler = (data) => {
		query.mutate(data)
	}

	if (query.isLoading) return '...loading';
	return (
		<>
			<ErrorAlert error={query.error} />
			<h1>Create Table</h1>
			<TableForm submitHandler={submitHandler} />
		</>
	);
}
