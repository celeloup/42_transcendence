import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
// import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/ChatList.scss';
import { ChannelContext, ContextType } from '../../contexts/ChannelContext';

type ChannelCategoryProps = {
	channelList: any,
	type: string
}

type ChannelProps = {
	channelObj: any,
}

function Channel({ channelObj} : ChannelProps) {
	var { channel, setChannel, toggleDisplayList } = useContext(ChannelContext) as ContextType;
	
	const selectChannel = () => {
		setChannel(channelObj);
		toggleDisplayList();
	}
	
	var selected:boolean;
	if (channel)
		selected = channel.name === channelObj.name;
	else
		selected = false;

	return (
		<div className={selected ? "channel selected" : "channel"} onClick={ selectChannel }>
			<div className={ "channelImg " + channelObj.type }></div>
			<div className="channelName">{ channelObj.name }</div>
		</div>
	)
}


function ChannelCategory({ channelList, type } : ChannelCategoryProps) {
	const [displayCategory, setDisplayCategory] = useState(true);
	const toggleDisplayCategory = (): void => {
		setDisplayCategory(!displayCategory);
	};

	var chans;
	if (channelList.length !== 0)
		chans = channelList.map((chan:any) => <Channel key={chan.id} channelObj={chan}/>)
	else
		chans = <p className="no_chan">No {type} channel yet.</p>
	
	return (
		<>
			<div className="separator">
				<div onClick={ toggleDisplayCategory }>
					<i className={ displayCategory ? "fas fa-chevron-down" : "fas fa-chevron-right" } ></i>
					{type}_
				</div>
				<div className="add_channel_button">+
					<span className="tooltiptop">Create channel</span>
				</div>
			</div>
			{ displayCategory && <div className="publicChannels">
				{ chans }
			</div> }
		</>
	)
}


function ChannelList () {
	const [channels, setChannels] = useState([]);
	const [channelsPriv, setChannelsPriv] = useState([]);
	const [channelsPub, setChannelsPub] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	// const { user } = useContext(AuthContext);
	var { toggleDisplayList } = useContext(ChannelContext) as ContextType;

	useEffect(() => {
		const filterPubChan = () => {
			var res = channels.filter((chan:any) => chan.private === false);
			setChannelsPub(res);
		};
		const filterPrivChan = () => {
			var res = channels.filter((chan:any) => chan.private === true);
			setChannelsPriv(res);
		};
		const getChannels = async () => {
			try {
				const res = await axios.get(`/channel`);
				setChannels(res.data);
				filterPubChan();
				filterPrivChan();
				setIsLoading(false);
			} catch (err) {
				console.log(err);
			}
		};
		getChannels();
	}, [isLoading]);
	
	return (
	<div id="channelList" >
		<div className="channelListWrapper">
			
			<i className="fas fa-times closeIcon" onClick={ toggleDisplayList }></i>
			<div className="channelSearchBar">
				<input type="text" placeholder="Search" id="channelSearch"></input>
				<i id="searchButton"className="fas fa-search"></i>
			</div>

			<div className="channelList">
				<ChannelCategory channelList={channelsPub} type="public"/>
				<ChannelCategory channelList={channelsPriv} type="private"/>
			</div>
		</div>
		{/* <div className="dummyModal" onClick={ toggleDisplayList }></div> */}
	</div>
	);
}

export default ChannelList;