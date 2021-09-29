
import { Chat } from './chat/Chat';
import { ChannelProvider } from '../contexts/ChannelContext';
import Game from './game/Game';

function Home() {
	return (
	  <div className="Home">
			<div className="body_wrapper">
				<Game></Game>
				<ChannelProvider>
					<Chat></Chat>
				</ChannelProvider>
			</div>
	  </div>
	);
  }
  
  export default Home;