import { RouteProps as RouterRouteProps, Route as RouterRoute } from 'react-router-dom';
import React from 'react';
import { AuthContext, ContextType } from '../contexts/AuthContext';
import Login from './Login';
import axios from 'axios';

export type RouteProps = {
	typeOfRoute: string
} & RouterRouteProps;
	  
export function Route({ typeOfRoute, ...routeProps}: RouteProps) {
	var { isAuth, login, logout } = React.useContext(AuthContext) as ContextType;
	const [loading, setLoading] = React.useState<boolean>(true);
	
	React.useEffect(() => {
		if (routeProps.path !== "/oauth")
		{
			// console.log("hello", routeProps.path);
			axios.get(`/authentication`)
			.then(response => { 
				// console.log("YES IS AUTH", response.data);
				const user = { 
					id: response.data.id, 
					id42: response.data.id42,
					isTwoFactorAuth: response.data.isTwoFactorAuthenticationEnabled,
					name: response.data.name
				}
				login(user);
				setLoading(false);
			})
			.catch(error => {
				console.log("ERROR: The user is not logged. Please log in.");
				setLoading(false);
				logout();
				// ----------------------------------------------------- TREAT ERROR 500
			})
		} else
		{
			setLoading(false);
		}
	}, [routeProps.path]);
	
	if (loading === false)
	{
		if (typeOfRoute === "protected")
		{
			if (isAuth) {
				return <RouterRoute{...routeProps} />;
			} else {
				
				return <Login></Login>;
			}
		} else {
			return <RouterRoute{...routeProps} />;
		}
	}
	else{
		return (<div>Loading ...</div>);
	}
};