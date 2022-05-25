import React from 'react';
import { formatAsDate, formatAsTime } from '../utils/date-time';

export default function ReservationCard({ res }) {
	return (
		<div className='col'>
			<div className='card'>
				<div className='card-body'>
					<h5 className='card-title'>
						{res.first_name} {res.last_name}
					</h5>
					<h6 className='card-subtitle mt-1 mb-2 text-muted'>
						{formatAsDate(res.reservation_date)}{' '}
						{formatAsTime(res.reservation_time)}
					</h6>
					<div className='card-text'>
						<ul className='list-group list-group-flush'>
							<li className='list-group-item'>
								Mobile Number: {res.mobile_number}
							</li>
							<li className='list-group-item'>
								Party: {res.people}
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
