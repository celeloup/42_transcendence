import { RouteProps as RouterRouteProps, Route as RouterRoute, Redirect } from 'react-router-dom';
import React from 'react';
import { AuthContext } from './AuthContext';

export type RouteProps = {
	typeOfRoute: string
} & RouterRouteProps;
	  
export function Route({ typeOfRoute, ...routeProps}: RouteProps) {
	const { isAuth } = React.useContext(AuthContext);
	
	if (typeOfRoute === "protected")
	{
		if (isAuth) {
			return <RouterRoute{...routeProps} />;
		} else {
			return <Redirect to={{ pathname: '/login' }} />;
		}
	} else {
		return <RouterRoute{...routeProps} />;
	}
};