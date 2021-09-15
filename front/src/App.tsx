// import React from 'react';
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom';
import './styles/App.scss';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Parameters from './pages/Parameters';

const Logo = () => (
	<div id="logo">
		<NavLink to='/'>
			<p>PonG</p>
			<p>warS</p>
		</NavLink>
	</div>
)

function App() {
  return (
	  <Router>
		<div className="App">
			<header className="App-header">
				<Logo />
			</header>
			<Switch>
				<Route path='/admin' component={Admin} />
				<Route path='/login' component={Login} />
				<Route path='/parameters' component={Parameters} />
				<Route path='/profile' component={Profile} />
				<Route path='/' exact component={Home} />
          </Switch>
		</div>
	  </Router>
  );
}

export default App;
