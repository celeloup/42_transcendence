import './styles/App.scss';
import React, { useEffect } from 'react';
import { AuthContext, AuthProvider, ContextType }  from './contexts/AuthContext';
import { BrowserRouter as Router, Switch, RouteComponentProps, Redirect } from 'react-router-dom';
import { Route } from './components/Route';
import Logo from './components/ui_components/Logo';

import Admin from './components/Admin';
import Home from './components/Home';
import Profile from './components/Profile';
import Parameters from './components/Parameters';

import axios from 'axios';

function OAuth({ location } : RouteComponentProps) {
	const { login } = React.useContext(AuthContext) as ContextType;
	let code:string = location.search;

	const [loading, setLoading] = React.useState(true);

	useEffect(() => {
		axios.get(`/authentication/oauth${code}`)
			.then(response => {
				// console.log("RESPONSE GOOD : ", response);
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
				console.log("Error catch :", error.response);
				setLoading(false);
			})
	}, [code]);

	if (loading === false)
		return <Redirect to={{ pathname: '/' }} />;
	else
		return <div>Loading ...</div>
}

const App = () => {
	return (
		<AuthProvider>
			<Router>
				<div className="App">
					<header className="App-header">
						<Logo />
					</header>
					<Switch>
						<Route
							typeOfRoute="protected"
							exact={true}
							path='/admin'
							component={Admin}
						/>
						<Route typeOfRoute="protected" path='/parameters' component={Parameters} />
						<Route
							typeOfRoute="protected"
							exact={true}
							path='/profile'
							component={Profile}
						/>
						<Route
							typeOfRoute="protected"
							exact={true}
							path='/'
							component={Home}
						/>
						<Route typeOfRoute="public" exact={true} path='/oauth' component={ OAuth } />
					</Switch>
				</div>
			</Router>
		</AuthProvider>
	)
}

export default App;
