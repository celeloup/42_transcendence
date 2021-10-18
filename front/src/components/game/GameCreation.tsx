import { useContext, useState } from 'react';
import { GameContext, ContextType } from '../../contexts/GameContext';
import UpArrow from '../../assets/img/up_arrow.svg';
import DownArrow from '../../assets/img/down_arrow.svg';

function GameCreation() {

	var { setToDisplay } = useContext(GameContext) as ContextType;
	const [ goal, setGoal ] = useState(10); // entre 1 et 20
	const [ speed, setSpeed ] = useState(1); // 0 slow, 1 normal, 2 fast
	const [ map, setMap ] = useState(1); // 1 space, 2 mario
	const [ boost, setBoost ] = useState(0); // 0 off, 1 on

	// const create_game = () => {
	// 	axios.post('/matches', {
	// 		"friendly": true,
	// 		"user1_id": 1,
	// 		"user2_id": 2,
	// 		"map": 0,
	// 		"speed": 1,
	// 		"goal": 10,
	// 		"boost_available": false
	// 	  })
	// 	  .then( res => { 
	// 		  	// console.log("create match success !", res);
	// 		  	socket.emit('create_game', res.data);
	// 			setMatch(res.data)
	// 		} )
	// 	  .catch ( err => { console.log("create match fail :(", err); } )
	// }


	function updateGoal(indice:number){
		if (indice == 1 && goal < 20)
			setGoal(goal + 1);
		if (indice == -1 && goal > 1)
			setGoal(goal - 1);
	}
	
	function updateSpeed(indice:number){
		if (indice == 1 && speed < 3)
			setGoal(goal + 1);
		if (indice == -1 && goal > 1)
			setGoal(goal - 1);
	}

	// has a user2 as optional param in case challenge from chat
	return (
		<div id="game_creation">
			<div className="window_header" >
				<i className="fas fa-arrow-left back_button" onClick={ ()=> setToDisplay("landing") }/>
				<i className="fas fa-meteor" />create_game_
			</div>
			<div id="game_settings_button">
				<div id="goal">
					<div>GOAL</div>
					<img className="settings_arrows" src={ UpArrow } onClick={() => updateGoal(1)} />
					<div className="settings_value">{ goal }</div>
					<img className="settings_arrows" src={ DownArrow } onClick={() => updateGoal(-1)}/>
				</div>
				<div id="speed">
					<div>SPEED</div>
					<img className="settings_arrows" src={ UpArrow } />
					<div className="settings_value">{ speed === 1 ? "normal" : (speed === 0 ? "slow" : "fast") }</div>
					<img className="settings_arrows" src={ DownArrow } />
				</div>
				<div id="boost">
					<div>BOOST</div>
					<img className="settings_arrows" src={ UpArrow } />
					<div className="settings_value">{ boost === 1 ? "on" : "off" }</div>
					<img className="settings_arrows" src={ DownArrow } />
				</div>
				<div id="map">
					<div>MAP</div>
					<img className="settings_arrows" src={ UpArrow } />
					<div className="settings_value">{ map === 1 ? "space" : "mario" }</div>
					<img className="settings_arrows" src={ DownArrow } />
				</div>
			</div>
			{/* <div>Send invitation</div> */}
		</div>
)}

export default GameCreation;