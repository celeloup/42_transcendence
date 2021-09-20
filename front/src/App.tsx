import './styles/App.scss';
// import axios from 'axios';
import React, { useEffect } from 'react';
import { AuthContext, AuthProvider, ContextType }  from './AuthContext';
import { BrowserRouter as Router, Route as RouterRoute, Switch, RouteComponentProps, Redirect } from 'react-router-dom';
import { Route } from './Route';
import Logo from './ui_components/Logo';

import Login from './pages/Login';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Parameters from './pages/Parameters';

import * as api from './API';

// const API_BASE_URL:string = "http://localhost:8080/api";

function OAuth({ location } : RouteComponentProps) {
	const { isAuth, login } = React.useContext(AuthContext) as ContextType;
	let code:string = location.search;
	console.log(isAuth, code);
	useEffect(()=> {
		login();
		api.oauth(code);
	}, []);
	// const [isAuth, setIsAuth] = useState(false);

	// useEffect(() => {
	// 	axios.get(`${API_BASE_URL}/authentication/oauth${code}`, { withCredentials: true })
	// 	.then(response => 
	// 		{
	// 			console.log(response.data);
	// 			// setIsAuth(true);
	// 		})
	// 	.catch(error => 
	// 		{
	// 			console.log(error.reponse);
	// 			// setIsAuth(false);
	// 		});
	// }, []);
	return <Redirect to={{ pathname: '/' }} />;
}

const App = () => {

	// const Auth = useContext(AuthContext);

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
						<RouterRoute path='/oauth' component={ OAuth } />
						<RouterRoute exact path='/login' component={Login} />
					</Switch>
				</div>
			</Router>
		</AuthProvider>
	)
}


// import React from 'react';
// import { BrowserRouter as Router, Route as RouterRoute, Switch, Redirect } from 'react-router-dom';
// import './styles/App.scss';
// import Logo from './ui_components/Logo';
// import Login from './pages/Login';
// import Admin from './pages/Admin';
// import Home from './pages/Home';
// import Profile from './pages/Profile';
// import Parameters from './pages/Parameters';
// import { RouteComponentProps, RouteProps as RouterRouteProps } from 'react-router';
// // import * as api from './API';
// import React, { useState, useEffect} from 'react';
// import axios from 'axios';


// function OAuth({ location } : RouteComponentProps) {
// 	let code:string = location.search;
// 	console.log(code);
// 	// api.oauth(code);
// 	// const [isAuth, setIsAuth] = useState(false);

// 	useEffect(() => {
// 		axios.get(`${API_BASE_URL}/authentication/oauth${code}`, { withCredentials: true })
// 		.then(response => 
// 			{
// 				console.log(response.data);
// 				// setIsAuth(true);
// 			})
// 		.catch(error => 
// 			{
// 				console.log(error.reponse);
// 				// setIsAuth(false);
// 			});
// 	}, []);
// 	return <Redirect to={{ pathname: '/' }} />;
// }

// export type RouteProps = {
// 	typeOfRoute: string,
// 	isAuthenticated: boolean;
// 	authenticationPath: string;
//   } & RouterRouteProps;
  
// export function Route({ typeOfRoute, isAuthenticated, authenticationPath, ...routeProps}: RouteProps) {
// 	if (typeOfRoute === "protected")
// 	{
// 		if (isAuthenticated) {
// 			return <RouterRoute{...routeProps} />;
// 		} else {
// 			return <Redirect to={{ pathname: authenticationPath }} />;
// 		}
// 	} else {
// 		return <RouterRoute{...routeProps} />;
// 	}
//   };

// interface User {
// 	id: number,
// 	name: string
// };

// const API_BASE_URL:string = "http://localhost:8080/api";

// export const AppContext = React.createContext({
// 	isAuthenticated: true,
// 	toggleIsAuthenticated: () => {},
// 	user: "celeloup", 
// 	setUser: () => {},
// });

// type AppProps = {}

// type AppState = {
// 	isAuthenticated: boolean,
// 	toggleIsAuthenticated: any,
// 	user: string, 
// 	setUser: any,
// }

// const defaultRoute: RouteProps = {
// 	typeOfRoute: "protected",
// 	isAuthenticated: isAuth,
// 	authenticationPath: '/login',
// };

// class App extends React.Component<AppProps, AppState> {
// 	toggleIsAuthenticated = () => {
// 		this.setState(state => ({
// 			isAuthenticated:
// 				state.isAuthenticated === true ? false : true,
// 		}));
// 	};

// 	setUser = () => {
// 		this.setState(state => ({
// 			user: state.user,
// 		}));
// 	};

// 	state = {
// 		isAuthenticated: true,
// 		toggleIsAuthenticated: this.toggleIsAuthenticated,
// 		user: "celeloup",
// 		setUser: this.setUser,
// 	};

// 	render () {
// 		return (
// 			<AppContext.Provider value={this.state}>
//  		<Router>
//  			<div className="App">
//  				<header className="App-header">
//  					<Logo />
//  				</header>
//  				<Switch>
//  					<Route
//  						{...defaultRoute}
//  						exact={true}
//  						path='/admin'
//  						component={Admin}
//  					/>
//  					{/* <Route path='/admin' component={Admin} /> */}
//  					{/* <Route
//  						{...defaultRoute}
//  						exact={true}
//  						path='/parameters'
//  						component={Parameters}
//  					/> */}
//  					<RouterRoute path='/parameters' component={Parameters} />
//  					<Route
//  						{...defaultRoute}
//  						exact={true}
//  						path='/profile'
//  						component={Profile}
//  					/>
//  					{/* <RouterRoutepath='/profile' component={Profile} /> */}
//  					<Route
//  						{...defaultRoute}
//  						exact={true}
//  						path='/'
//  						component={Home}
//  					/>
//  					{/* <RouterRouteexact path='/'  component={Home} /> */}
//  					<Route typeOfRoute="public" isAuthenticated={false} authenticationPath="/login" exact={true} path='/oauth' component={ OAuth } />
//  					<RouterRoute path='/oauth' component={OAuth} />
//  					<RouterRoute exact path='/login' component={Login} />
//  				</Switch>
//  			</div>
//  		</Router>
//  		</AppContext.Provider>
// 		)
// 	}
// }


// function App() {
// 	const [isAuth, setIsAuth] = useState(false);

// 	useEffect(() => {
// 		const fetchAuth = () => {
// 			axios.get(`${API_BASE_URL}/authentication`, { withCredentials: true })
// 			.then(response => { console.log(response.data); setIsAuth(true); })
// 			.catch(error => { console.log(error.reponse); setIsAuth(false); });
// 		};
// 		fetchAuth();
// 		console.log(isAuth);
// 	}, []);


	// let user:boolean = api.isAuth();
	// console.log("hello");
	// console.log(user);
	// api.authRefresh();
// 	const defaultRoute: RouteProps = {
// 		typeOfRoute: "protected",
// 		isAuthenticated: isAuth,
// 		authenticationPath: '/login',
// 	};
// 	return (
// 		<AppContext.Provider value={{ isAuthenticated: true, user: "celeloup" }}>
		// <Router>
		// 	<div className="App">
		// 		<header className="App-header">
		// 			<Logo />
		// 		</header>
		// 		<Switch>
		// 			<Route
		// 				{...defaultRoute}
		// 				exact={true}
		// 				path='/admin'
		// 				component={Admin}
		// 			/>
		// 			{/* <Route path='/admin' component={Admin} /> */}
		// 			{/* <Route
		// 				{...defaultRoute}
		// 				exact={true}
		// 				path='/parameters'
		// 				component={Parameters}
		// 			/> */}
		// 			<RouterRoute path='/parameters' component={Parameters} />
		// 			<Route
		// 				{...defaultRoute}
		// 				exact={true}
		// 				path='/profile'
		// 				component={Profile}
		// 			/>
		// 			{/* <RouterRoutepath='/profile' component={Profile} /> */}
		// 			<Route
		// 				{...defaultRoute}
		// 				exact={true}
		// 				path='/'
		// 				component={Home}
		// 			/>
		// 			{/* <RouterRouteexact path='/'  component={Home} /> */}
		// 			<Route typeOfRoute="public" isAuthenticated={false} authenticationPath="/login" exact={true} path='/oauth' component={ OAuth } />
		// 			<RouterRoute path='/oauth' component={OAuth} />
		// 			<RouterRoute exact path='/login' component={Login} />
		// 		</Switch>
		// 	</div>
		// </Router>
// 		</AppContext.Provider>
// 	);
// }

export default App;
