import { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { ChannelContext, ContextType } from '../../contexts/ChannelContext';
import '../../styles/ChatAdmin.scss';

type ChannelAdminProps = {
	chanId: number
}

type MemberCardProps = {
	member:any,
	channel:any
}

function MemberCard ( { member, channel } : MemberCardProps) {
	const { name, id } = member;

	const [ displayDrop, setDisplayDrop ] = useState(false);

	var owner = id === channel.owner.id;
	var banned = channel.banned.some((ban:any) => ban[id] === id) ? "" : "";
	var muted = channel.muted.some((mute:any) => mute[id] === id) ? "" : "inactive";

	return (
		<div className="member_card">
			<div className="member_status">
				{ name }
				{ owner && <i className="fas fa-crown"></i> }
				{ !owner && <i className="fas fa-shield-alt"></i> }
				{ !owner && <i className={ `fas fa-user-slash action ${ banned }` }></i> }
				{ !owner && <i className={ `fas fa-comment-slash action ${ muted }` }></i> }
			</div>
		</div>
	)
}

export function ChannelAdmin () {
	
	const [ chan, setChan ] = useState<any>(null);
	var { toggleDisplayAdmin, channel } = useContext(ChannelContext) as ContextType;
	
	useEffect(() => {
		if (channel)
		{
			axios.get(`/channel/infos/${ channel.id }`)
			.then( res => {
				console.log("RES chan infos", res);
				setChan(res.data);
			})
			.catch (err => {
				console.log("Error:", err);
			})
		}
	}, []);

	var members;
	if (chan)
		members = chan.members.map((m:any) => <MemberCard key={ m.id } member={ m } channel={ chan }/>);
	else
		members = <p>Loading...</p>

	return (
		<div id="channel_admin">
			{/* hello this is the admin chan */}
			<i className="fas fa-times close_icon" onClick={ toggleDisplayAdmin }></i>
			<div id="member_list">
				{ members }
			</div>
		</div>
	)
}