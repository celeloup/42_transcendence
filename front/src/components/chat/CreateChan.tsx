import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
// import { AuthContext, ContextType as AuthContextType }  from '../../contexts/AuthContext';
import '../../styles/chat/CreateChan.scss';
import { ChannelContext, ContextType } from '../../contexts/ChannelContext';
import SearchUser from 'components/ui_components/SearchUser';

// type User = {
// 	id: number,
// 	name: string
// };

type channelSettings = {
	type: number,
	name: string,
	password: string, 
	otherUserIdForPrivateMessage: number
};

type CreateChanProps = {
	type : number,
	hide : (type: number) => void
};

function CreateChan({ type, hide } : CreateChanProps) {
	// const { user } = useContext(AuthContext) as AuthContextType; // might remove once create chan change
	var { toggleDisplayList, channel, setChannel, socket } = useContext(ChannelContext) as ContextType;
	const [ isLoading, setIsLoading ] = useState(false);
	// -------- List users
	const [users, setUsers] = useState<any[]>([]);
	
	useEffect(() => {
		axios.get('/users')
		.then ( res => {
			setUsers(res.data);
		})
		.catch (err => { console.log(err); })
	}, []);

	// ------ Style password
	const [ typePassword, setTypePassword ] = useState(true);

	// ------- Channel data
	const [ chanType, setChanType ] = useState<number>(type);
	const [ chanName, setChanName ] = useState<string>("");
	const [ chanPassword, setChanPassword ] = useState<string>("");
	const [ userDM, setUserDM ] = useState(0);
	const [ errors, setErrors ] = useState<Array<{key:string, value:string}>>([]);
	
	const handleSubmit = (e:any) => {
		e.preventDefault();
		
		let nameRegex = /^([a-zA-Z0-9_-]+([ ]?[a-zA-Z0-9_-]+)?)+$/;
		let passwordRegex = /[ -~]/;
		
		var temp_errors = [];
		if (chanType !== 3 && nameRegex.test(chanName) === false)
			temp_errors.push({key:"name", value:"The channel's name must not contain special characters or whitespaces at the extremities."});
		if (chanType !== 3 &&  chanName.length > 20)
			temp_errors.push({ key: "name_length", value:"The channel's name must be between 2 and 15 characters long"});
		if (chanType !== 3 &&  chanPassword !== "" && passwordRegex.test(chanPassword) === false)
			temp_errors.push({key:"password", value:"The password cannot contain non printable characters."});
		if (temp_errors.length === 0)
		{
			// console.log(errors);
			var chanSettings:channelSettings = {
				type: chanType,
				name: (chanType === 1 || chanType === 2) ? chanName : "DM", 
				password: chanType === 2 ? chanPassword : "",
				otherUserIdForPrivateMessage: userDM
			};
			// console.log(chanSettings);
			const submitNewChannel = async () => {
				setIsLoading(true);
				axios.post('/channel', chanSettings)
				.then( res => {
					// console.log ("RES post new chan", res);
					if (channel)
						socket.emit('leave_chan', channel.id);
					setChannel(res.data);
					hide(0);
					toggleDisplayList();
				})
				.catch (err => {
					console.log(err);
					setIsLoading(false);
				})
			};
			submitNewChannel();
		}
		else
			setErrors(temp_errors);
	};
	// ---------- ??
	var chanInfo;
	var chanForm;
	if (chanType === 1)
	{
		chanInfo = "/i\\ This channel will be accessible to everyone.";
		chanForm = <label>
			Name your channel
			<input 
				autoFocus={true}
				autoComplete="off"
				id="channelName"
				name="name"
				value={ chanName }
				onChange={ (e) => setChanName(e.target.value) }
			/>
		</label>
	}
	else if (chanType === 2)
	{
		chanInfo = "/i\\ This channel will only be accessible to the members of your choosing or anyone that knows the password.";
		chanForm = <><label>
			Name your channel
			<input 
				autoFocus={true}
				autoComplete="off"
				id="channelName"
				name="name"
				value={ chanName }
				onChange={ (e) => setChanName(e.target.value) }
			/>
			</label>
			<label id="passwordLabel">
				Set a password
				<input
					autoComplete="off"
					className={ typePassword ? "passwordInput" : ""} 
					type="text"
					value={ chanPassword }
					onChange={ (e) => setChanPassword(e.target.value) }
				/>
				<span>optional</span>
				<i className={ typePassword ? "fas fa-eye-slash" : "fas fa-eye" } onClick={ () => setTypePassword(!typePassword)}></i>
			</label></>
	}
	else
	{
		chanInfo = "/i\\ Start a private conversation with an other member.";
		chanForm = <div id="select_user">
				<SearchUser theme="yo" list={ users } select={ setUserDM } />
			</div>
	}

	var errorList = errors.length !== 0 
		? errors.map((error:any) => <div className="errorChanCreation" key={error.key}><i className="fas fa-skull-crossbones"><span>ERROR</span></i>{error.value}</div>)
		: <></>;

	return (
		<div id="addChanWrapper">
			<div id="addChan">
				<p>Choose the channel's type</p>
				<i className="fas fa-times closeIcon" onClick={ () => hide(0) }></i>
				
				<div id="typeChanSelect">
					<div
						className={ chanType === 1 ? "selected" : "" } 
						onClick={ () => { setChanType(1); setErrors([]); setUserDM(0); }} >
						Public
					</div>
					<div
						className={ chanType === 2 ? "selected" : "" } 
						onClick={ () => { setChanType(2); setErrors([]); setUserDM(0); }} >
						Private
					</div>
					<div
						className={ chanType === 3 ? "selected" : "" }
						onClick={ () => { setChanType(3); setErrors([]); setUserDM(0); } } >
						DM
					</div>
				</div>

				<div className="infosChan"> { chanInfo } </div>
				
				<form onSubmit={ handleSubmit }>
					{ chanForm }
					{ errorList }
					<input 
						className={ (chanType !== 3 && chanName !== "") || userDM !== 0 ? "readyToSubmit" : "" }
						type="submit" 
						value={ isLoading ? "Loading..." : "Create channel" }
					/>
				</form>

			</div>
		</div>
	)
}

export default CreateChan;