import { useContext, useState, useEffect } from 'react';
import { GameContext, ContextType } from '../../contexts/GameContext';
import { AuthContext, ContextType as AuthContextType } from '../../contexts/AuthContext';
import { Arrow } from '../ui_components/Arrow';
import { ToggleButton } from '../ui_components/ToggleButton';
import { Speedometer } from '../ui_components/Speedometer';
import axios from "axios";
import '../../styles/game/Creation.scss';
import SearchUser from 'components/ui_components/SearchUser';


type SelectPlayerProps = {
	display: (val:boolean) => void,
	setInvitedPlayer: (user:any) => void
}

const SelectPlayer = ({ display, setInvitedPlayer } : SelectPlayerProps) => {
	// const [ isLoading, setIsLoading ] = useState(false);
	const [ users, setUsers ] = useState<any[]>([]);
	const [ user, setUser ] = useState(0);
	// var { masterSocket } = useContext(AuthContext) as AuthContextType;

	useEffect(() => {
		axios.get(`/users`)
		.then( res => {
			// console.log(res.data);
			setUsers(res.data);
		})
		.catch( err => {
			console.log(err);
		})
	}, []);

	const handleSubmit = () => {
		if (user !== 0) {
			// console.log(user);
			setInvitedPlayer(user);
			display(false);
		}
	}

	return (
		<div id="choose_player_popup">
			<i className="fas fa-times" onClick={ () => display(false) }/>
			[ select a player to challenge ]
			<SearchUser theme="yo" list={ users } select={ setUser } byID={false}/>
			<div className={ user !== 0 ? "ready" : "" } id="submit" onClick={ handleSubmit }>Select</div>
		</div>
	)
}

function GameCreation() {

	var { setMatch } = useContext(GameContext) as ContextType;
	var { masterSocket, setToDisplay, user } = useContext(AuthContext) as AuthContextType;
	const [ goal, setGoal ] = useState(10); // entre 1 et 20
	const [ speed, setSpeed ] = useState(1); // 0 slow, 1 normal, 2 fast
	const [ map, setMap ] = useState(1); // 1 space, 2 mario (street fighter ? )
	const [ boost, setBoost ] = useState(false);
	const [ invitedPlayer, setInvitedPlayer ] = useState<any>(null);
	const [ displayChoosePlayer, setDisplayChoosePlayer ] = useState(false);

	const create_game = () => {
		// var match = {
		// 	"user1_id": user?.id,
		// 	"user2_id": invitedPlayer ? invitedPlayer.id : 1,
		// 	"map": map,
		// 	"speed": speed,
		// 	"goal": goal,
		// 	"boost_available": boost
		//   };
		// console.log(match);
		axios.post('/matches', {
			"friendly": true,
			"user1_id": user?.id,
			"user2_id": invitedPlayer ? invitedPlayer.id : 1,
			"map": map,
			"speed": speed,
			"goal": goal,
			"boost_available": boost
		  })
		  .then( res => { 
			  	// console.log("create match success !", res.data);
				setMatch(res.data);
				if (invitedPlayer)
					masterSocket.emit('send_invit', res.data);
				else
					masterSocket.emit('create_game', res.data);
				setToDisplay("pong");
			} )
		  .catch ( err => { alert("create match fail :("); console.log(err) } )
	}

	function updateGoal(direction: string){
		if (direction === "up" && goal < 20)
			setGoal(goal + 1);
		else if (direction === "down" && goal > 1)
			setGoal(goal - 1);
	}
	
	function updateSpeed(){
		if (speed === 2)
			setSpeed(0);
		else
			setSpeed(speed + 1);
	}

	function updateBoost(direction: string) {
		if (direction === "up" && boost)
			setBoost(false);
		else if (direction === "down" && !boost)
			setBoost(true);
	}

	function updateMap(direction: string) {
		if (map === 3 && direction === "down")
			setMap(1);
		else if (direction === "down")
			setMap(map + 1);
		else if (map === 1 && direction === "up")
			setMap(3);
		else
			setMap(map - 1);
	}

	return (
		<div id="game_creation">
			<div className="window_header" >
				<i className="fas fa-arrow-left back_button" onClick={ ()=> setToDisplay("landing") }/>
				<i className="fas fa-meteor" />create_game_
			</div>
			{ displayChoosePlayer && 
			<div id="card_modal" onClick={ (e:any) => { if (e.target.id === "card_modal") setDisplayChoosePlayer(false)}}>
				<SelectPlayer display={ setDisplayChoosePlayer } setInvitedPlayer={ setInvitedPlayer } /> 
			</div> }
			<div id="game_settings_button">
				<div id="goal">
					<div>GOAL</div>
					<Arrow direction="up" state={ goal < 20 ? "active" : "disabled" } click={ updateGoal }/>
					<div className="settings_value">{ goal }</div>
					<Arrow direction="down" state={ goal > 1 ? "active" : "disabled" } click={ updateGoal }/>
					<div className="explanation">Adjust the number of points you need <br/>to win a game.<br/><span style={{"color": "#919191", "fontSize": "12px"}}>Max is 20. We don't want you to be here all night.</span></div>
				</div>
				<div id="speed">
					<div>SPEED</div>
					<div onClick={ updateSpeed } className={ speed === 0 ? "settings_value slow_speed" : "settings_value" }>
						<Speedometer speed={ speed} />
						<p className={speed === 2 ? "fast_speed" : "" }>{ speed === 1 ? "normal" : (speed === 0 ? "slow" : "fast") }</p>
					</div>
					<div className="explanation">Adjust the speed of the ball. <br/><span style={{"color": "#919191", "fontSize": "12px"}}>Be careful, the fast one is ... fast.</span></div>
				</div>
				<div id="boost">
					<div>BOOST</div>
					<div id="toggle">
						<ToggleButton direction={ boost ? "down" : "up" }/>
						<p id="off" onClick={ () => updateBoost("up") } className={ boost ? "disabled" : "active" }>off</p>
						<p id="on" onClick={ () => updateBoost("down") } className={ boost ? "active" : "disabled" }>on</p>	
					</div>
					<div className="explanation">When enabled, random objects will pop on your screen. Catch them with the ball and earn a random bonus ... or malus !<br/>
					<span style={{"color": "#919191", "fontSize": "12px"}}>Example: bigger paddles, faster ball ...</span></div>
				</div>
				<div id="map">
					<div>MAP</div>
					<Arrow direction="up" state={ "active" } click={ updateMap }/>
					<div className={ map === 1 ? "space settings_value" : (map === 2 ? "mario settings_value" : "street settings_value") }><p>{ map === 1 ? "space" : "mario" }</p></div>
					<Arrow direction="down" state={ "active"  } click={ updateMap }/>
					<div className="explanation">Personnalize your game with our <span style={{"color": "#919191", "textDecoration": "line-through"}}>never seen before</span>, i mean cool maps.</div>
				</div>
			</div>
			<div id="challenge_button" className="button" onClick={ () => setDisplayChoosePlayer(true) }>{ invitedPlayer ? "CHALLENGE " + invitedPlayer.name.toUpperCase() : "CHALLENGE A PLAYER" }</div>
			<br/><div id="create_game_button" className="button" onClick={ create_game }>CREATE GAME</div>
		</div>
)}

export default GameCreation;