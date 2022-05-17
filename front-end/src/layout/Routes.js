import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';
import Dashboard from '../dashboard/Dashboard';
import Reservations from '../reservations/Reservations';
import NotFound from './NotFound';
import { today } from '../utils/date-time';

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
	return (
		<Switch>
			<Route exact={true} path='/'>
				<Reservations />
			</Route>
			<Route exact={true} path='/reservations'>
				<Redirect to={'/dashboard'} />
			</Route>
			<Route path='/dashboard'>
				<Dashboard date={today()} />
			</Route>
			<Route>
				<NotFound />
			</Route>
		</Switch>
	);
}

export default Routes;
