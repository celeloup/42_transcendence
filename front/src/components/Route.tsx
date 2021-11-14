import { RouteProps as RouterRouteProps, Route as RouterRoute } from 'react-router-dom';
import React from 'react';
import { AuthContext, ContextType } from '../contexts/AuthContext';
import Login from './Login';
import Home from './Home';
import axios from 'axios';

export type RouteProps = {
	typeOfRoute: string
} & RouterRouteProps;
	  
export function Route({ typeOfRoute, ...routeProps}: RouteProps) {
	var { isAuth, user, login, logout } = React.useContext(AuthContext) as ContextType;
	const [loading, setLoading] = React.useState<boolean>(true);
	
	React.useEffect(() => {
		if (routeProps.path !== "/oauth")
		{
			axios.get(`/users/infos/me`)
			.then(response => {
				// console.log("RES isAuth", response.data);
				const user = { 
					id: response.data.id,
					site_owner: response.data.site_owner,
					site_moderator: response.data.site_moderator,
					site_banned: response.data.site_banned,
					id42: response.data.id42,
					isTwoFactorAuth: response.data.isTwoFactorAuthenticationEnabled,
				}
				if (user.site_banned === true)
				{
					console.log("ERROR: You were banned from the website by an admin.");
					logout();
				}
				else
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
		}
		else if (typeOfRoute === "admin")
		{
			if (isAuth && (user?.site_owner || user?.site_moderator)) {
				return <RouterRoute{...routeProps} />;
			} else {
				return <Home></Home>;
			}
		}
		else {
			return <RouterRoute{...routeProps} />;
		}
	}
	else{
		return (<div>Loading ...</div>);
	}
};