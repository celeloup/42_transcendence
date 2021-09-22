import NavButton from './ui_components/NavButton';
import '../styles/Chat.scss';
import '../styles/UI.scss';
import WindowBorder from './ui_components/WindowBorder';
import { useState } from 'react';
import ChannelList from './chat/ChannelList';
import { Message } from './chat/ChannelConversation';

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