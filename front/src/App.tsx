import './styles/App.scss';
import React, { useEffect } from 'react';
import { AuthContext, AuthProvider, ContextType }  from './contexts/AuthContext';
import { BrowserRouter as Router, Switch, RouteComponentProps, Redirect } from 'react-router-dom';
import { Route } from './components/Route';

import Admin from './components/Admin';
import Home from './components/Home';
import Profile from './components/Profile';
import Parameters from './components/Parameters';
import TwoFA from './components/TwoFA';
import axios from 'axios';
import PageWrapper from './components/ui_components/PageWrapper';

function OAuth({ location } : RouteComponentProps) { 
	const { login } = React.useContext(AuthContext) as ContextType;
	let code:string = location.search;

	const [loading, setLoading] = React.useState(true);
	const [isTwoFA, setIsTwoFA] = React.useState(false);

	useEffect(() => {
		axios.get(`/authentication/oauth${code}`)
			.then(response => {
				// console.log("RES Oauth : ", response);
				const user = { 
					id: response.data.id,
					site_owner: response.data.site_owner,
					site_moderator: response.data.site_moderator,
					site_banned: response.data.site_banned,
					id42: response.data.id42,
					isTwoFactorAuth: response.data.isTwoFactorAuthenticationEnabled,
				}
				login(user);
				setIsTwoFA(response.data.isTwoFactorAuthenticationEnabled);
				setLoading(false);

			})
			.catch(error => {
				console.log("Error catch :", error.response);
				// if (!error.data)
				// 	alert("Looks like the back is down !!\n\nERR_EMPTY_RESPONSE");
				setLoading(false);
			})
	}, [code]); // eslint-disable-line

	if (loading === true)
		return <div>Loading ...</div>
	else if (isTwoFA)
		return <Redirect to={{ pathname: '/2fa' }} />
	else
		return <Redirect to={{ pathname: '/' }} />
}

const App = () => {
	return (
		<Router>
			<AuthProvider>
				<div className="App">
					<PageWrapper>
					<Switch>
						<Route
							typeOfRoute="protected"
							exact={true}
							path='/'
							component={ Home }
						/>
						<Route
							typeOfRoute="protected"
							exact={true}
							path='/parameters'
							component={ Parameters }
						/>
						<Route
							typeOfRoute="protected"
							exact={true}
							path='/profile/:id'
							component={ Profile }
						/>
						<Route
							typeOfRoute="protected"
							exact={true}
							path='/admin'
							component={ Admin }
						/>
						<Route
							typeOfRoute="public"
							exact={true}
							path='/oauth'
							component={ OAuth }
						/>
						<Route
							typeOfRoute="public"
							exact={true}
							path='/2fa'
							component={ TwoFA }
						/>
					</Switch>
					</PageWrapper>
				</div>
			</AuthProvider>
		</Router>
	)
}

export default App;
