import React from 'react'
import { Route, Switch, useRouteMatch } from 'react-router'
import CreateTable from './CreateTable';

export default function Tables() {
	const { path } = useRouteMatch();
  return (
	  <Switch>
		  <Route path={`${path}/new`}>
			  <CreateTable />
		  </Route>
	</Switch>
  )
}
