import { Chat } from './chat/Chat';
import { ChannelProvider } from '../contexts/ChannelContext';
import { GameProvider } from '../contexts/GameContext';
import Game from './game/Game';

function Home() {
	return (
		<div id="home">
			<GameProvider>
				<Game></Game>
			</GameProvider>
			<ChannelProvider>
				<Chat></Chat>
			</ChannelProvider>
		</div>
	);
  }
  
export default Home;