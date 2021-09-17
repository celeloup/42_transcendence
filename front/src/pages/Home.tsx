import NavButton from '../ui_components/NavButton';
import '../styles/Chat.scss';
import '../styles/UI.scss';
import WindowBorder from '../ui_components/WindowBorder';
import React, { useState } from 'react';

function Game() {
	return (
		<WindowBorder w='816px' h='670px'>
		<div id="game">
			<div className="window_header">
				MACHIN VS TRUC
			</div>
			<div id="game_window">
				hello
			</div>
		</div>
	</WindowBorder>
)}

type PropsFunction = () => void;

type ChatHeaderProps = {
	toggleDisplayList: PropsFunction,
	type: string,
	name: string
	// ADD PROFILE PIC
}
// props = type conv(string), name conv(string), notif ?
function ChatHeader({toggleDisplayList, type, name} : ChatHeaderProps) {
	return (
		<div className="window_header chat_header">
			<i className="fas fa-bars header_button" onClick={toggleDisplayList}></i>
			<div className="header_title">
				<i className="fas fa-user-friends"></i>{ name }
			</div>
			<i className="fas fa-cog header_button"></i>
			{/* <i className="fas fa-comment-alt"></i> */}
		</div>
	)
}

type MessageProps = {
	username: string,
	message: string
	// ADD PROFILE PIC
}

function Message ({ username, message }: MessageProps) {
	return (
		<div className="chat_message">
			<div className="chat_profile_pic"></div>
			<div className="chat_message_content">
				<div className="chat_message_username">{username}</div>
				<div className="chat_message_text">{message}</div>
			</div>
		</div>
	)
}

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


// state : notif, current channel, messageInput
function Chat() {
	const [displayList, setDisplayList] = useState(false);
	const toggleDisplayList = (): void => {
		setDisplayList(!displayList);
	}
	return (
		<WindowBorder w='382px' h='670px'>
			<div id="chat">
				{ displayList && 
					<ChannelList toggleDisplayList={ toggleDisplayList } selected="General"/>
				}
				<ChatHeader toggleDisplayList={toggleDisplayList} type="0" name="General"/>
				<div id="chat_messages">
					<div>
						<div className="chat_date">13/09/2021</div>
						<Message username="celia" message="helloooo"/>
						<Message username="flavien" message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."/>
						<Message username="flavien" message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."/>
						<Message username="flavien" message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."/>
						<Message username="flavien" message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."/>
						<Message username="flavien" message="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."/>
						<Message username="jeanne" message="g rien compris ... il parle quelle langue ?"/>
					</div>
				</div>
				<div id="chat_input">
					<i className="fas fa-chevron-right"></i>
					<input type="text" id="message_input" autoComplete="off"></input>
					<i className="fas fa-paper-plane"></i>
				</div>
			</div>
		</WindowBorder>
	)
}


function Home() {
	return (
	  <div className="Home">
			<div id="navBar" className="rotate_right">
				<NavButton name="Parameters" icon="fa-cog" link="/parameters"></NavButton>
				<NavButton name="Profile" icon="fa-user-circle" link="/profile"></NavButton>
				<NavButton name="Admin" icon="fa-cog" link="/admin"></NavButton>
			</div>
			<div className="body_wrapper">
				<Game></Game>
				<Chat></Chat>
			</div>
	  </div>
	);
  }
  
  export default Home;