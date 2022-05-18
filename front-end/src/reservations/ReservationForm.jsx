import React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router';

export default function ReservationForm(props) {
	
	const {
		initialState = {
			first_name: '',
			last_name: '',
			mobile_number: '',
			reservation_date: '',
			reservation_time: '',
			people: 1,
		},
		submitHandler,
	} = props;
	
	const history = useHistory();

	const [formData, setFormData] = useState(initialState);
	const [errors, setErrors] = useState(null);
	
	const changeHandler = ({ target }) => {
		setFormData({ ...formData, [target.name]: target.value });
	};
	
	const onSubmit = (event) => {
		event.preventDefault();
		submitHandler(formData);
	}

	const cancelHandler = () => {
		history.goBack();
	};
	
	return (
		<form onSubmit={onSubmit} className='g-4'>
			<div className='row mb-2'>
				<div className='form-group col-md-6 col-xl-4'>
					<label htmlFor='first_name'>First Name</label>
					<input
						type='text'
						name='first_name'
						className='form-control'
						id='first_name'
						onChange={changeHandler}
						value={formData.first_name}
						required
					/>
				</div>
				<div className='form-group col-md-6 col-xl-4'>
					<label htmlFor='last_name'>Last Name</label>
					<input
						type='text'
						name='last_name'
						className='form-control'
						id='lastName'
						onChange={changeHandler}
						value={formData.last_name}
						required
					/>
				</div>
			</div>
			<div className='row mb-2'>
				<div className='form-group col-xl-2 col-md-6 mb-3'>
					<label htmlFor='mobile_number'>Mobile Number</label>
					<div className='input-group'>
						<span className='input-group-text'>+1</span>
						<input
							type='tel'
							pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
							placeholder='123-456-7890'
							name='mobile_number'
							className='form-control'
							id='mobile_number'
							onChange={changeHandler}
							value={formData.mobile_number}
							required
						/>
					</div>
				</div>
				<div className='form-group col-xl-2 col-md-6 mb-3'>
					<label htmlFor='reservation_date'>Reservation Date</label>
					<input
						type='date'
						name='reservation_date'
						className='form-control'
						id='reservation_date'
						onChange={changeHandler}
						value={formData.reservation_date}
						required
					/>
				</div>
				<div className='form-group col-xl-2 col-md-6 mb-3'>
					<label htmlFor='reservation_time'>Reservation Time</label>
					<input
						type='time'
						name='reservation_time'
						className='form-control'
						id='reservation_time'
						onChange={changeHandler}
						value={formData.reservation_time}
						required
					/>
				</div>
				<div className='form-group col-xl-2 col-md-6 mb-3'>
					<label htmlFor='people'>People in Party</label>
					<input
						type='number'
						name='people'
						className='form-control'
						id='people'
						onChange={changeHandler}
						value={formData.people}
						required
					/>
				</div>
			</div>
			<div>
				<button
					type='button'
					onClick={cancelHandler}
					className='btn btn-secondary'>
					Cancel
				</button>
				<button type='submit' className='btn btn-primary m-2'>
					Submit
				</button>
			</div>
		</form>
	);
}
