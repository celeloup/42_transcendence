
import Coin from '../../assets/img/coin.svg';
import KO from '../../assets/img/street_fighter_ko.png';
import Telescope from '../../assets/img/telescope.svg';
import TelescopeTop from '../../assets/img/telescope_top.svg';

type endScreenProps = {
	score1: number,
	score2: number,
	setToDisplay: (s:string) => void
}

function EndScreen({ score1, score2, setToDisplay } : endScreenProps) {
	return (
		<div id="end_screen">
			<div> GAME FINISHED </div>
			<div>{ score1 } VS { score2 }</div>
			<div id="back_button" onClick={ ()=> setToDisplay("landing") }> Return home </div>
		</div>
	)
}

type InfoProps = {
	setToDisplay: (s:string) => void,
	type: number,
	user?: string
}

function InfoError({ setToDisplay, type, user } : InfoProps) {
	let message;
	if (type === 1)
		message = "We searched the entire galaxy and no one is currently looking for a second player. Why don't you create your own game ?";
	else if (type === 2)
		message = `${ user } refused your challenge (the coward). Maybe try creating a new game and challenge someone who won't be scared of your pong skills.`;
	else if (type === 3)
		message = `Looks like ${ user } left the game in fear of your superior pong skills. What a shame.`;
	else if (type === 4)
		message = `${ user } is currently offline. The universe is big, you can probably find someone else to play a match of pong with.`;
	return (
		<div id="infos_error_game">
			{ type === 1 &&
				<div id="telescope_img"><img id="telescope_top" src={ TelescopeTop } alt="Telescope img top"/>
				<img id="telescope" src={ Telescope } alt="Telescope img"/></div>
			}
			{ type === 1 && <p id="title">No match found</p>}
			{ type === 2 && <p id="title">Match declined</p>}
			{ type === 3 && <p id="title">Player 1 is missing</p>}
			{ type === 4 && <p id="title">Player 2 offline</p>}
			<p>{ message }</p>
			<div className="buttons">
				<div id="back_button" onClick={ ()=> setToDisplay("landing") }> <i className="fas fa-arrow-left"/> Go back </div>
				<div id="create_game_button" onClick={ ()=> setToDisplay("create") }>Create a game</div>
			</div>
		</div>
	)
}

type BackgroundProps = {
	p1: string,
	p2: string,
	scoreP1: number,
	scoreP2: number,
	goal?: number,
	allP1?: number,
	allP2?: number
}

function Space({ p1, p2, scoreP1, scoreP2 }: BackgroundProps) {
	return (
		<div className="game_background" id="space">
			<div id="p1">
				{ p1 }
			</div>
			<div id="scores">
				<span>{ scoreP1 }</span>
				<span>{ scoreP2 }</span>
			</div>
			<div id="p2">
				{ p2 }
			</div>
		</div>
	)
}

function Mario({ p1, p2, scoreP1, scoreP2, allP1, allP2 }: BackgroundProps) {
	return (
		<div className="game_background" id="mario">
			<div id="names">
				<span>{ p1 }</span>
				<span>{ p2 }</span>
			</div>
			<div id="points">
				<div id="p1">
					<span className="all_score">{ allP1?.toString().padStart(6, '0') }</span>
					<img src={ Coin } alt="Coin from Mario."/>
					<span >x{ scoreP1 < 10 ? "0" + scoreP1 : scoreP1 }</span>
				</div>
				<div id="p2">
					<img src={ Coin } alt="Coin from Mario."/>
					<span>x{ scoreP2 < 10 ? "0" + scoreP2 : scoreP2 }</span>
					<span className="all_score">{ allP2?.toString().padStart(6, '0') }</span>
				</div>
			</div>
		</div>
	)
}

function Street({ p1, p2, scoreP1, scoreP2, allP1, allP2, goal }: BackgroundProps) {
	let p1_life:number;
	if (goal)
		p1_life = 100 - (scoreP2 / goal) * 100;
	else
		p1_life = 100;
	let p2_life:number;
		if (goal)
			p2_life = 100 - (scoreP1 / goal) * 100;
		else
			p2_life = 100;
	return (
		<div className="game_background" id="street">
			<div id="first_line">
				<div id="p1">
					<img alt="Player1" src="https://nfggames.com/system/arcade/arcade.php/y-sf2/z-8/dbl-3/x-1P"/>
					<img alt="Player1 total score" src={ "https://nfggames.com/system/arcade/arcade.php/y-sf2/z-8/dbl-3/x-" + allP1?.toString().padStart(5, '0') }/>
				</div>
				<div id="p2">
					<img  alt="Player2" src="https://nfggames.com/system/arcade/arcade.php/y-sf2/z-8/dbl-3/x-2P"/>
					<img  alt="Player2 total score" src={ "https://nfggames.com/system/arcade/arcade.php/y-sf2/z-8/dbl-3/x-" + allP2?.toString().padStart(5, '0') }/>
				</div>
			</div>
			<div id="life_bar">
				<div id="p1_bar"><span style={{"width": p1_life + "%"}}></span></div>
				<img src={ KO } alt="Street_fighter_ko"/>
				<div id="p2_bar"><span style={{"width": p2_life + "%"}}></span></div>
			</div>
			<div id="last_line">
				<img alt="Player1 name" className="name" src={"https://nfggames.com/system/arcade/arcade.php/y-sf2/z-8/dbl-3/x-" + p1.toUpperCase()}/>
				<img alt="Player2 name" className="name" src={"https://nfggames.com/system/arcade/arcade.php/y-sf2/z-8/dbl-3/x-" + p2.toUpperCase()}/>
			</div>
		</div>
	)
}

export { EndScreen, InfoError, Space, Street, Mario };