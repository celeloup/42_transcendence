import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import '../../styles/chat/ChatList.scss';
import { ChannelContext, ContextType } from '../../contexts/ChannelContext';
import { AuthContext, ContextType as AuthContextType } from '../../contexts/AuthContext';
import CreateChan from './CreateChan';
import React from 'react';
import { isBlock } from 'typescript';

type ChannelCategoryProps = {
	channelList: any,
	type: string,
	search: string,
	setDisplayCreateChan: (type:number) => void;
}

type ChannelProps = {
	chan: any,
}

function Channel({ chan } : ChannelProps) {
	var { channel, setChannel, socket, toggleDisplayList } = useContext(ChannelContext) as ContextType;
	var { user } = useContext(AuthContext) as AuthContextType;
	
	const selectChannel = () => {
		if (channel)
			socket.emit('leave_chan', channel.id);
		setChannel(chan);
		toggleDisplayList();
	}
	
	var selected:boolean;
	if (channel)
		selected = channel.id === chan.id;
	else
		selected = false;

	var name = chan.type !== 3 ? chan.name : (chan.members[0].id === user?.id ? chan.members[1].name : chan.members[0].name);

	return (
		<div className={ selected ? "channel selected" : "channel" } onClick={ selectChannel }>
			<div className={ "channelImg " + chan.type }></div>
			<div className="channelName">{ name }</div>
		</div>
	)
}

function ChannelCategory({ channelList, type, search, setDisplayCreateChan } : ChannelCategoryProps) {
	const [displayCategory, setDisplayCategory] = useState(true);
	const toggleDisplayCategory = (): void => {
		setDisplayCategory(!displayCategory);
	};

	const toggleDisplayCreateChan = (): void => {
		if (type === "public")
			setDisplayCreateChan(1);
		else if (type === "private")
			setDisplayCreateChan(2);
		else if (type === "dm")
			setDisplayCreateChan(3);
	}

	var chans;
	if (channelList.length !== 0)
		chans = channelList.map((chan:any) => {
			if (chan.name.includes(search))
				return (<Channel key={ chan.id } chan={ chan }/>);
			else
				return (<React.Fragment key={ chan.id }></React.Fragment>);
		})
	else
		chans = <p className="no_chan">No { type } channel yet.</p>
	
	return (
		<>
			<div className="separator">
				<div onClick={ toggleDisplayCategory }>
					<i className={ displayCategory ? "fas fa-chevron-down" : "fas fa-chevron-right" } ></i>
					{type}_
				</div>
				<div className="add_channel_button" onClick={ toggleDisplayCreateChan }>+
					<span className="tooltiptop">Create channel</span>
				</div>
			</div>
			{ displayCategory && <div className="publicChannels">
				{ chans }
			</div> }
		</>
	)
}

function IsBlocked(blocked:any[], members:any[])
{
	members.forEach(m => {
		var test = blocked.some((block:any) => block.id === m.id) ? true : false;
		if (test)
			return (true);
	});
	return false;
}

function ChannelList () {
	const [ channels, setChannels ] = useState<any[]>([]);
	const [ isLoading, setIsLoading ] = useState(true);
	const [ displayCreateChan, setDisplayCreateChan ] = useState<number>(0);
	const [ search, setSearch ] = useState<string>("");
	const [ blockedUsers, setBlockedUsers ] = useState<any[]>([]);

	var { toggleDisplayList } = useContext(ChannelContext) as ContextType;
	var { user } = useContext(AuthContext) as AuthContextType;

	useEffect(() => {
		axios.get(`/users/infos/me`)
		.then( res => {
			// console.log("GET infos me", res);
			setBlockedUsers(res.data.blocked);
		})
		.catch (err => {
			console.log("Error:", err);
		})
		
		axios.get(`/channel/`)
		.then( res => {
			var admin = user?.site_owner || user?.site_moderator;
			if (!admin)
			{
				// Filter to get all inaccessible
				var chans = res.data.filter((c:any) => {
					if (c.type === 1)
						return (true);
					else if (c.type === 2 && c.passwordSet)
						return (c.members.some((mem:any) => mem.id === user?.id) ? false : true)
				});
				// Get channels user is already in
				axios.get(`/users/channels/${ user?.id }`)
				.then( res => {
					var chans2 = res.data.filter((c:any) => c.type !== 1);
					setChannels(chans.concat(chans2));
					setIsLoading(false);
				})
				.catch (err => {
					console.log("Error:", err);
				})
			}
			else
			{
				setChannels(res.data);
				setIsLoading(false);
			}
		})
		.catch (err => {
			console.log("Error:", err);
		})
	}, []);

	var publicChans = channels.filter((chan:any) => chan.type === 1);
	var privateChans = channels.filter((chan:any) => chan.type === 2);
	var dms = channels.filter((chan:any) => {
		if (chan.type === 3)
		{
			var m = chan.members[0].id === user?.id ? chan.members[1] : chan.members[0];
			var ret = blockedUsers.every((b, i) => {
				if (b.id === m.id)
					return false;
			})
			return (ret);
		}
		return (false);
	});
	
	return (
	<div id="channelList" >
		{ displayCreateChan !== 0 && <CreateChan type={ displayCreateChan } hide={ setDisplayCreateChan }/> }
		<div className="channelListWrapper">
			<i className="fas fa-times closeIcon" onClick={ toggleDisplayList }></i>
			<div className="channelSearchBar">
				<input type="text" placeholder="Search" id="channelSearch" value={search} onChange={ e => setSearch(e.target.value) }></input>
				<i id="searchButton"className="fas fa-search"></i>
			</div>
			{ isLoading && <span>Loading...</span>}
			{ !isLoading && 
				<div className="channelList">
					<ChannelCategory channelList={ publicChans } type="public" setDisplayCreateChan={ setDisplayCreateChan } search={ search }/>
					<ChannelCategory channelList={ privateChans } type="private" setDisplayCreateChan={ setDisplayCreateChan } search={ search }/>
					<ChannelCategory channelList={ dms } type="dm" setDisplayCreateChan={ setDisplayCreateChan } search={ search }/>
				</div>
			}
		</div>
	</div>
	);
}

export default ChannelList;