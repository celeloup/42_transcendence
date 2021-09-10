import NavButton from '../ui_components/NavButton';
import '../styles/Chat.scss';
import '../styles/UI.scss';
import WindowBorder from '../ui_components/WindowBorder';

function Game() {
	return (
		<WindowBorder w='859px' h='670px'>
		<div id="game">
			{/* <div className="window_header">
				MACHIN VS TRUC
			</div> */}
		</div>
	</WindowBorder>
)}

function Chat() {
	return (
		<WindowBorder w='360px' h='670px'>
			<div id="chat">
				{/* <div className="window_header">
					General
				</div> */}
			</div>
		</WindowBorder>
)}


function Home() {
	return (
	  <div className="Home">
		  <p>
			this is the Home page
		  </p>
			<div id="navBar" className="rotate_right">
				<NavButton name="Parameters" link="/parameters"></NavButton>
				<NavButton name="Profile" link="/profile"></NavButton>
				<NavButton name="Admin" link="/admin"></NavButton>
			</div>
			<div className="body_wrapper">
				<Game></Game>
				<Chat></Chat>
			</div>
	  </div>
	);
  }
  
  export default Home;