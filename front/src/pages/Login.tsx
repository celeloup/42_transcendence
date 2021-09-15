import axios from 'axios';
import { RouteComponentProps } from 'react-router';

// async function loginUser()

type TParams = { code: string };

function Login({match} : RouteComponentProps<TParams>) {
	console.log(match.url); 
  return (
    <div className="Login">
        <p>Pong Wars is an amazing game where you can challenge your friends to a match of Pong in Space ! <br></br>Login to play</p>
		<div id="42LoginButton"><a href="https://api.intra.42.fr/oauth/authorize?client_id=19e5ab89328bbc134e124cc4611ecc7c3fd0d88176bd38eda6e7ee23d649df3b&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth&response_type=code">Login 42</a></div>
	</div>
  );
}

export default Login;
