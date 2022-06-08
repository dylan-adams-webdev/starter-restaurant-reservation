import React from 'react';
import { DateTime as dt, Duration } from 'luxon';
import { Link } from 'react-router-dom';

export default function ReservationCard(props) {
	const { res } = props;
	
	const date = dt.fromISO(res.reservation_date);
	const time = Duration.fromISOTime(res.reservation_time);
	const dateTime = date.plus(time);
	
	

	return (
		<div className='col-md-4 m-2'>
			<div className='card'>
				<div className='card-body'>
					<h5 className='card-title d-flex justify-content-between'>
						<div>
							{res.first_name} {res.last_name}
						</div>
						<div>
							<span
								className='badge badge-sm bg-secondary'
								data-reservation-id-status={res.reservation_id}
							>
								{res.status}
							</span>
						</div>
					</h5>
					<h6 className='card-subtitle mt-1 mb-2 text-muted'>
						{dateTime.toLocaleString(dt.DATETIME_FULL)}
					</h6>
					<div className='card-text d-flex justify-content-between'>
						<div>
							<div>
								<span className='oi oi-phone'></span>
								&nbsp;{res.mobile_number}
							</div>
							<div>
								<span className='oi oi-people'></span>
								&nbsp;{res.people}
							</div>
						</div>
						<div>
							{res.status === 'booked' ? (
								<Link
								className='btn btn-outline-primary'
								href={`/reservations/${res.reservation_id}/seat`}
								to={`reservations/${res.reservation_id}/seat`}
							>
								Seat
							</Link>
							) : (
									null
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
