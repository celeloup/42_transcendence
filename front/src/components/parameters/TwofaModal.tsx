import axios from 'axios';
import React, { useEffect } from 'react';
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
	const [message, setMessage] = React.useState<number>(0);
	const coderef = React.createRef<HTMLInputElement>();

	useEffect(() => {
		setMessage(0);
	}, [modalVisible]);

	const sendCode = (code : string) : void => {
		setTwofaCode(code);
		if (code.length === 6)
		{
			const node = coderef.current;
			if (node)
				node.blur();

			if (!is2FA) {
				axios.post("/2fa/turn-on", { twoFactorAuthenticationCode: code })
				.then(response => { setIs2FA(true); setTwofaCode(""); setMessage(1); setTimeout(() => { setModalVisible(false); }, 1500); })
				.catch(error => { setTwofaCode(""); setMessage(2); });
			}
		}
	}

	return (
		<div className={"modal" + (modalVisible ? " visible" : "" )} /*onClick={() => {setModalVisible(false)}}*/>
			<div className={"modal_content" + (modalVisible ? " visible" : "" )}>
				{qrCode && <img className="qr_code" src={qrCode} alt="2FA QR Code"></img>}
				{ message === 0 && <p>Scan the QR Code with Google Authenticator<br />and type the code you get below</p>}
				{ message === 1 && <p>2FA was successfully turned on ✔️</p>}
				{ message === 2 && <p>Couldn't turn on 2FA ❌<br />(Try scanning the QR code again)</p>}
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