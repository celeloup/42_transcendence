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
			axios.get(`/authentication`)
			.then(response => { 
				console.log("RES isAuth", response.data);
				const user = { 
					id: response.data.id,
					site_owner: response.data.site_owner,
					site_moderator: response.data.site_moderator,
					site_banned: response.data.site_banned,
					id42: response.data.id42,
					isTwoFactorAuth: response.data.isTwoFactorAuthenticationEnabled,
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
	}, [routeProps.path]); // eslint-disable-line
	
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