// import React from 'react';
import { BrowserRouter as Router, Route, Switch, NavLink, Redirect } from 'react-router-dom';
import './styles/App.scss';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Parameters from './pages/Parameters';
import { RouteComponentProps, RouteProps } from 'react-router';
import * as api from './API';

const Logo = () => (
	<div id="logo">
		<NavLink to='/'>
			<p>PonG</p>
			<p>warS</p>
		</NavLink>
	</div>
)

type TParams = { code: string };

function OAuth({ match, location, history } : RouteComponentProps<TParams>) {
	let code:string = location.search;
	console.log(code);
	api.oauth(code);
	return <Redirect to={{ pathname: '/' }} />;
}

export type ProtectedRouteProps = {
	isAuthenticated: boolean;
	authenticationPath: string;
  } & RouteProps;
  
export function ProtectedRoute({isAuthenticated, authenticationPath, ...routeProps}: ProtectedRouteProps) {
	if(isAuthenticated) {
	  return <Route {...routeProps} />;
	} else {
	  return <Redirect to={{ pathname: authenticationPath }} />;
	}
  };

function App() {
	let user:boolean = api.isAuth();
	console.log("hello");
	// console.log(user);
	// api.authRefresh();
	const defaultProtectedRouteProps: ProtectedRouteProps = {
		isAuthenticated: user,
		authenticationPath: '/login',
	};
	return (
		<Router>
			<div className="App">
				<header className="App-header">
					<Logo />
				</header>
				<Switch>
					<ProtectedRoute
						{...defaultProtectedRouteProps}
						exact={true}
						path='/admin'
						component={Admin}
					/>
					{/* <Route path='/admin' component={Admin} /> */}
					<ProtectedRoute
						{...defaultProtectedRouteProps}
						exact={true}
						path='/parameters'
						component={Parameters}
					/>
					{/* <Route path='/parameters' component={Parameters} /> */}
					<ProtectedRoute
						{...defaultProtectedRouteProps}
						exact={true}
						path='/profile'
						component={Profile}
					/>
					{/* <Route path='/profile' component={Profile} /> */}
					<ProtectedRoute
						{...defaultProtectedRouteProps}
						exact={true}
						path='/'
						component={Home}
					/>
					{/* <Route exact path='/'  component={Home} /> */}
					<Route path='/oauth' component={OAuth} />
					<Route exact path='/login' component={Login} />
				</Switch>
			</div>
		</Router>
	);
}

export default App;
