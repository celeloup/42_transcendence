import { Chat } from './chat/Chat';
import { ChannelProvider } from '../contexts/ChannelContext';
import Game from './game/Game';

function Home() {
	return (
		<div id="home">
			<Game></Game>
			{/* <ChannelProvider>
				<Chat></Chat>
			</ChannelProvider> */}
		</div>
	);
  }
  
export default Home;