import axios from 'axios';
import React from 'react';
import '../../styles/parameters/Parameters.scss';
import '../../styles/parameters/TwofaModal.scss';

type Props = {
	modalVisible: boolean;
	setModalVisible: (b: boolean) => void;
	is2FA: boolean;
	setIs2FA: (b: boolean) => void;
	qrCode: string;
}

function TwofaModal ( { modalVisible, setModalVisible, is2FA, setIs2FA, qrCode } : Props ) {
	const [twofaCode, setTwofaCode] = React.useState<string>("");
	const coderef = React.createRef<HTMLInputElement>();

	const sendCode = (code : string) : void => {
		setTwofaCode(code);
		if (code.length === 6)
		{
			const node = coderef.current;
			if (node)
				node.blur();

			if (is2FA) {
				axios.post("/2fa/turn-off", { twoFactorAuthenticationCode: code })
				.then(response => { setModalVisible(false); setIs2FA(false); setTwofaCode(""); })
				.catch(error => { console.log(error.response); setTwofaCode(""); });
			}
			else {
				axios.post("/2fa/turn-on", { twoFactorAuthenticationCode: code })
				.then(response => { setModalVisible(false); setIs2FA(true); setTwofaCode(""); })
				.catch(error => { setTwofaCode(""); });
			}
		}
	}

	return (
		<div className={"modal" + (modalVisible ? " visible" : "" )} /*onClick={() => {setModalVisible(false)}}*/>
			<div className={"modal_content" + (modalVisible ? " visible" : "" )}>
				{qrCode && <img className="qr_code" src={qrCode} alt="2FA QR Code"></img>}
				<p>Scan the QR Code with Google Authenticator</p>
				<p>and type the code you get below</p>
				<input
						className="six_digit_code"
						type="text"
						value={twofaCode}
						onChange={e => sendCode(e.target.value)}
						ref={coderef}
						maxLength={6}>
				</input>
				<button className="close_button fas fa-times fa-3x" onClick={() => { setModalVisible(false); setTwofaCode(""); }}></button>
			</div>
		</div>
	);
  }
  
  export default TwofaModal;