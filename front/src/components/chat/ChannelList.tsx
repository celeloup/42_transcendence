import { useState } from 'react';

type ChannelProps = {
	name: string,
	image: string,
	type: string,
	selected: boolean
}

function Channel({name, image, type, selected} : ChannelProps) {
	return (
		<div className={selected ? "channel selected" : "channel"} >
			<div className={ "channelImg " + type }></div>
			<div className="channelName">{ name }</div>
		</div>
	)
}

type PropsFunction = () => void;

type ChannelListProps = {
	toggleDisplayList: PropsFunction,
	selected: string
}

function ChannelList ({ toggleDisplayList, selected } : ChannelListProps) {
	const [displayPublicChan, setDisplayPublicChan] = useState(true);
	const [displayPrivateChan, setDisplayPrivateChan] = useState(true);
	const toggleDisplayPublicChan = (): void => {
		setDisplayPublicChan(!displayPublicChan);
	};
	const toggleDisplayPrivateChan = (): void => {
		setDisplayPrivateChan(!displayPrivateChan);
	};
	return (
		<div id="channelList" >
			<div className="channelListWrapper">
				<i className="fas fa-times closeIcon" onClick={ toggleDisplayList }></i>
				{/* <div className="channelListTitle">channels_</div> */}
				<div className="channelSearchBar">
					<input type="text" placeholder="Search" id="channelSearch"></input>
					<i id="searchButton"className="fas fa-search"></i>
				</div>
				<div className="channelList">
					<div className="separator">
						<div onClick={ toggleDisplayPublicChan }>
							<i className={ displayPublicChan ? "fas fa-chevron-down" : "fas fa-chevron-right" } ></i>
							public_
						</div>
						<div className="add_channel_button">+
							<span className="tooltiptop">Create channel</span>
						</div>
					</div>
					{ displayPublicChan && <div className="publicChannels">
						<Channel name="General" image="" type="group" selected={ true }/>
						<Channel name="Random" image="" type="group" selected={ false }/>
					</div> }
					<div className="separator">
						<div onClick={ toggleDisplayPrivateChan }>
							<i className={ displayPrivateChan ? "fas fa-chevron-down" : "fas fa-chevron-right" } ></i>
							private_
						</div>
						<div className="add_channel_button">+
							<span className="tooltiptop">Create channel</span>
						</div>
					</div>
					{ displayPrivateChan && <div className="privateChannels">
						<Channel name="Jeanne" image="" type="dm" selected={false} />
						<Channel name="Flavien" image="" type="dm" selected={false}/>
						<Channel name="Les boss" image="" type="group" selected={false}/>
						<Channel name="Anthony" image="" type="dm" selected={false}/>
						{/* <Channel name="Jeanne" image="" type="dm" selected={false} />
						<Channel name="Flavien" image="" type="dm" selected={false}/>
						<Channel name="Les boss" image="" type="group" selected={false}/>
						<Channel name="Anthony" image="" type="dm" selected={false}/> */}
					</div>}

				</div>
			</div>
			<div className="dummyModal" onClick={ toggleDisplayList }></div>
		</div>
	)
}

export default ChannelList;