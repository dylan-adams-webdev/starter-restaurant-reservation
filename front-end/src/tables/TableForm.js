import React, { useState } from 'react';
import { useHistory } from 'react-router';

export default function TableForm(props) {
	const {
		submitHandler,
		initialState = {
			table_name: '',
			capacity: 0,
		},
	} = props;

	const hx = useHistory();

	const [formData, setFormData] = useState(initialState);

	const onSubmit = (event) => {
		event.preventDefault();
		submitHandler(formData);
	};

	const changeHandler = ({ target }) => {
		if (target.name === 'capacity')
			return setFormData({ ...formData, capacity: Number(target.value) });
		setFormData({ ...formData, [target.name]: target.value });
	};

	const cancelHandler = () => {
		hx.goBack();
	};

	return (
		<form onSubmit={onSubmit}>
			<div className='row mb-2'>
				<div className='form-group col-md-6 col-xl-4'>
					<label htmlFor='first_name'>Table Name</label>
					<input
						type='text'
						name='table_name'
						className='form-control'
						id='table_name'
						minLength={2}
						onChange={changeHandler}
						value={formData.table_name}
						required
					/>
				</div>
				<div className='form-group col-md-1'>
					<label htmlFor='last_name'>Capacity</label>
					<input
						type='number'
						name='capacity'
						className='form-control'
						id='capacity'
						onChange={changeHandler}
						value={formData.capacity}
						min='1'
						required
					/>
				</div>
			</div>

			<div>
				<button
					type='button'
					onClick={cancelHandler}
					className='btn btn-secondary'
				>
					Cancel
				</button>
				<button type='submit' className='btn btn-primary m-2'>
					Submit
				</button>
			</div>
		</form>
	);
}
