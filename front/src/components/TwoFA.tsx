import axios from 'axios';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, RouteComponentProps, Redirect } from 'react-router-dom';
import '../styles/parameters/TwofaModal.scss';

function TwoFA () {
	const [twofaCode, setTwofaCode] = React.useState<string>("");
	const [message, setMessage] = React.useState<number>(0);
	const coderef = React.createRef<HTMLInputElement>();
	const [success, setSuccess] = React.useState<boolean>(false)

	const sendCode = (code : string) : void => {
		setTwofaCode(code);
		if (code.length === 6)
		{
			const node = coderef.current;
			if (node)
				node.blur();

			axios.post("/2fa/authenticate", { twoFactorAuthenticationCode: code })
			.then(response => { setTwofaCode(""); setMessage(1); setTimeout(() => { setSuccess(true) }, 1500); })
			.catch(error => { setTwofaCode(""); setMessage(2); });
		}
	}

	if (success)
		return <Redirect to={{ pathname: '/' }} />
	else
		return (
			<div style={{ height: "250px", top: "calc(50% - 100px)", }} className="content visible">
				<div style={{ position: "relative", top: "20px" }}>
					{ message === 0 && <p>Go in Google Authenticator<br />and type the code linked to your account</p>}
					{ message === 1 && <p>You're successfully authenticated ✔️</p>}
					{ message === 2 && <p>Couldn't authenticate you, try again ❌</p>}
				</div>
				<input
						style={{ position: "relative", top: "30px" }}
						className="six_digit_code"
						type="text"
						value={twofaCode}
						onChange={e => sendCode(e.target.value)}
						ref={coderef}
						maxLength={6}>
				</input>
			</div>
		);
  }
  
  export default TwoFA;