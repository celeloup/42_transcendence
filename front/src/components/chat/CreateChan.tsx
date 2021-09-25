import { useState, useContext } from 'react';
import { AuthContext, ContextType }  from '../../contexts/AuthContext';

type channelSettings = {
	type: number,
	name: string,
	password: string,
	members: [],
	owner_id: number
}

function CreateChan(type:number) {
	const { user } = useContext(AuthContext) as ContextType;

	const [ chanType, setChanType ] = useState<number>(type);
	const [ chanSettings, setChanSettings ] = useState<channelSettings>(
		{
			type: type, 
			name: "", 
			password: "", 
			members: [], 
			owner_id: user? user.id : 1 // TO CHANGE LATER OR TO REMOVE
		});
	
	return (
		<div id="addChan">
			hello
		</div>
	)
}

export default CreateChan;