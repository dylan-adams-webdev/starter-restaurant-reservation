import React from 'react';
import { DateTime as dt, Duration } from 'luxon';

export default function ReservationCard({ res }) {
	const date = dt.fromISO(res.reservation_date);
	const time = Duration.fromISOTime(res.reservation_time);
	const dateTime = date.plus(time);

	return (
		<div className='col'>
			<div className='card'>
				<div className='card-body'>
					<h5 className='card-title'>
						{res.first_name} {res.last_name}
					</h5>
					<h6 className='card-subtitle mt-1 mb-2 text-muted'>
						{dateTime.toLocaleString(dt.DATETIME_FULL)}
					</h6>
					<div className='card-text'>
						<div>
							<span className='oi oi-phone'></span>
							&nbsp;{res.mobile_number}
						</div>
						<div>
							<span className='oi oi-people'></span>
							&nbsp;{res.people}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
