import { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { ChannelContext, ContextType } from '../../contexts/ChannelContext';
import '../../styles/ChatAdmin.scss';

type ChannelAdminProps = {
	chanId: number
}

export function ChannelAdmin () {
	
	const [ chan, setChan ] = useState<any>();
	var { toggleDisplayAdmin, channel } = useContext(ChannelContext) as ContextType;
	
	useEffect(() => {
		if (channel)
		{
			axios.get(`/channel/infos/${ channel.id }`)
			.then( res => {
				console.log("RES chan infos", res);
			})
			.catch (err => {
				console.log("Error:", err);
			})
		}
	}, []);

	return (
		<div id="channelAdmin">
			hello this is the admin chan
			<i className="fas fa-times closeIcon" onClick={ toggleDisplayAdmin }></i>
		</div>
	)
}