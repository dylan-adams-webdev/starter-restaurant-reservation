import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router';
import CreateReservation from './CreateReservation';

export default function Reservations() {
	const { path } = useRouteMatch();
	return (
		<Switch>
			<Route path={`${path}/new`}>
				<CreateReservation />
			</Route>
		</Switch>
	);
}
