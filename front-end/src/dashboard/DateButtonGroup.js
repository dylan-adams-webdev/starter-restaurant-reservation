import React from 'react';

export default function DateButtonGroup({ nav }) {
	return (
		<div className='btn-group' role='group' aria-label='Basic example'>
			<button
				type='button'
				className='btn btn-primary'
				onClick={() => nav(-1)}>
				<span className='oi oi-chevron-left'></span>
			</button>
			<button
				type='button'
				className='btn btn-primary'
				onClick={() => nav(0)}>
				Today
			</button>
			<button
				type='button'
				className='btn btn-primary'
				onClick={() => nav(1)}>
				<span className='oi oi-chevron-right'></span>
			</button>
		</div>
	);
}
