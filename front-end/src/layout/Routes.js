import React from 'react';

import { Route, Switch } from 'react-router-dom';
import Dashboard from '../dashboard/Dashboard';
import Reservations from '../reservations/Reservations';
import Search from '../search/Search';
import Tables from '../tables/Tables'
import NotFound from './NotFound';

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
				<Dashboard />
			</Route>
			<Route path='/reservations'>
				<Reservations />
			</Route>
			<Route path='/dashboard'>
				<Dashboard />
			</Route>
			<Route path='/tables'>
				<Tables />
			</Route>
			<Route path='/search'>
				<Search />
			</Route>
			<Route>
				<NotFound />
			</Route>
		</Switch>
	);
}

export default Routes;
