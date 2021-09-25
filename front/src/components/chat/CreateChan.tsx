import { useState, useContext } from 'react';
import { AuthContext, ContextType }  from '../../contexts/AuthContext';
import '../../styles/CreateChan.scss';
type channelSettings = {
	type: number,
	name: string,
	password: string,
	members: [],
	owner_id: number
}

type CreateChanProps = {
	type : number,
	hide : (type: number) => void
}

function CreateChan({ type, hide } : CreateChanProps) {
	const { user } = useContext(AuthContext) as ContextType;

	const [ typePassword, setTypePassword ] = useState(true);

	const [ chanType, setChanType ] = useState<number>(type);
	const [ chanSettings, setChanSettings ] = useState<channelSettings>(
		{
			type: type, 
			name: "", 
			password: "", 
			members: [], 
			owner_id: user? user.id : 1 // TO CHANGE LATER OR TO REMOVE
		});
	const handleSubmit = (e:any) => {
		e.preventDefault();
		setChanSettings({
			type: type, 
			name: "", 
			password: "", 
			members: [], 
			owner_id: user? user.id : 1 // TO CHANGE LATER OR TO REMOVE
		});
		console.log(chanSettings);
	}
	return (
		<div id="addChanWrapper">
			<div id="addChan">
				<p>Choose the channel's type</p>
				<i className="fas fa-times closeIcon" onClick={ () => hide(0) }></i>
				<div id="typeChanSelect">
					<div className={ chanType === 1 ? "selected" : "" } onClick={ () => setChanType(1) } >Public</div>
					<div className={ chanType === 2 ? "selected" : "" } onClick={ () => setChanType(2) } >Private</div>
					<div className={ chanType === 3 ? "selected" : "" } onClick={ () => setChanType(3) } >DM</div>
				</div>
				<div className="infosChan">
					{ chanType === 1 && "/i\\ This channel will be accessible to everyone."}
					{ chanType === 2 && "/i\\ This channel will only be accessible to the members of your choosing."}
					{ chanType === 3 && "/i\\ Start a private conversation with an other member."}
				</div>
				<form onSubmit={ handleSubmit }>
					<label>
						Name your channel
						<input autoFocus={true} id="channelName" name="channelName"></input>
					</label>
					<label id="passwordLabel">
						Set a password
						<input autoComplete="off" type={ typePassword ? "password" : "text" }></input>
						<span>optional</span>
						<i className={ typePassword ? "fas fa-eye-slash" : "fas fa-eye" } onClick={ () => setTypePassword(!typePassword)}></i>
					</label>
					<input type="submit" value="Create channel"/>
				</form>
			</div>
		</div>
	)
}

export default CreateChan;