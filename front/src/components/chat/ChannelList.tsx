import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import '../../styles/Chat/ChatList.scss';
import { ChannelContext, ContextType } from '../../contexts/ChannelContext';
import CreateChan from './CreateChan';
import React from 'react';

type ChannelCategoryProps = {
	channelList: any,
	type: string,
	search: string,
	setDisplayCreateChan: (type:number) => void;
}

type ChannelProps = {
	channelObj: any,
}

function Channel({ channelObj } : ChannelProps) {
	var { channel, changeChannel, toggleDisplayList } = useContext(ChannelContext) as ContextType;
	
	const selectChannel = () => {
		changeChannel(channelObj);
		// toggleDisplayList();
	}
	
	var selected:boolean;
	if (channel)
		selected = channel.id === channelObj.id;
	else
		selected = false;

	return (
		<div className={selected ? "channel selected" : "channel"} onClick={ selectChannel }>
			<div className={ "channelImg " + channelObj.type }></div>
			<div className="channelName">{ channelObj.name }</div>
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
		else if (type === "DM")
			setDisplayCreateChan(3);
	}

	var chans;
	if (channelList.length !== 0)
		chans = channelList.map((chan:any) => {
			if (chan.name.includes(search))
				return (<Channel key={chan.id} channelObj={chan}/>);
			else
				return (<React.Fragment key={chan.id}></React.Fragment>);
		})
	else
		chans = <p className="no_chan">No {type} channel yet.</p>
	
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

function ChannelList (socket:any) {
	const [ channels, setChannels ] = useState([]);
	const [ isLoading, setIsLoading ] = useState(true);
	const [ displayCreateChan, setDisplayCreateChan ] = useState<number>(0);
	const [search, setSearch] = useState<string>("");

	var { toggleDisplayList } = useContext(ChannelContext) as ContextType;

	useEffect(() => {
		axios.get(`/channel/`)
		.then( res => {
			setChannels(res.data);
			setIsLoading(false);
		})
		.catch (err => {
			console.log("Error:", err);
		})
	}, []);

	var publicChans = channels.filter((chan:any) => chan.type === 1);
	var privateChans = channels.filter((chan:any) => chan.type === 2);
	
	return (
	<div id="channelList" >
		{ displayCreateChan !== 0 && <CreateChan type={ displayCreateChan } hide={ setDisplayCreateChan } socket={socket}/> }
		<div className="channelListWrapper">
			<i className="fas fa-times closeIcon" onClick={ toggleDisplayList }></i>
			<div className="channelSearchBar">
				<input type="text" placeholder="Search" id="channelSearch" value={search} onChange={ e => setSearch(e.target.value) }></input>
				<i id="searchButton"className="fas fa-search"></i>
			</div>
			{ isLoading && <span>Loading...</span>}
			{ !isLoading && 
				<div className="channelList">
					<ChannelCategory channelList={ publicChans } type="public" setDisplayCreateChan={ setDisplayCreateChan } search={search}/>
					<ChannelCategory channelList={ privateChans } type="private" setDisplayCreateChan={ setDisplayCreateChan } search={search}/>
				</div>
			}
		</div>
	</div>
	);
}

export default ChannelList;