import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router';
import CreateReservation from './CreateReservation';
import Seat from './Seat';

export default function Reservations() {
	const { path } = useRouteMatch();
	return (
		<Switch>
			<Route path={`${path}/new`} exact>
				<CreateReservation />
			</Route>
			<Route path={`${path}/:reservation_id/seat`} exact>
				<Seat />
			</Route>
		</Switch>
	);
}
