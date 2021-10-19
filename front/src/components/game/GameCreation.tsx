import { useContext, useState } from 'react';
import { GameContext, ContextType } from '../../contexts/GameContext';
import { Arrow } from '../ui_components/Arrow';
import { ToggleButton } from '../ui_components/ToggleButton';
import { Speedometer } from '../ui_components/Speedometer';

function GameCreation() {

	var { setToDisplay } = useContext(GameContext) as ContextType;
	const [ goal, setGoal ] = useState(10); // entre 1 et 20
	const [ speed, setSpeed ] = useState(1); // 0 slow, 1 normal, 2 fast
	const [ map, setMap ] = useState(3); // 1 space, 2 mario (street fighter ? )
	const [ boost, setBoost ] = useState(false);

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
		// if (direction === "up" && map < 3)
		// 	setMap(map + 1);
		// else if (direction === "down" && map > 1)
		// 	setMap(map - 1);
	}

	// function updateMap(direction: string) {
	// 	if (direction === "up" && boost !== 1)
			
	// }

	// console.log("goal, speed, boost, map", goal, speed, boost, map);

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
					<Arrow direction="up" state={ goal < 20 ? "active" : "disabled" } click={ updateGoal }/>
					<div className="settings_value">{ goal }</div>
					<Arrow direction="down" state={ goal > 1 ? "active" : "disabled" } click={ updateGoal }/>
				</div>
				<div id="speed">
					<div>SPEED</div>
					<div onClick={ updateSpeed } className={ speed === 0 ? "settings_value slow_speed" : "settings_value" }>
						<Speedometer speed={ speed} />
						<p className={speed === 2 ? "fast_speed" : "" }>{ speed === 1 ? "normal" : (speed === 0 ? "slow" : "fast") }</p>
					</div>
				</div>
				<div id="boost">
					<div>BOOST</div>
					<div id="toggle">
						<ToggleButton direction={ boost ? "down" : "up" }/>
						<p id="off" onClick={ () => updateBoost("up") } className={ boost ? "disabled" : "active" }>off</p>
						<p id="on" onClick={ () => updateBoost("down") } className={ boost ? "active" : "disabled" }>on</p>
					</div>
				</div>
				<div id="map">
					<div>MAP</div>
					<Arrow direction="up" state={ "active" } click={ updateMap }/>
					<div className={ map === 1 ? "space settings_value" : (map === 2 ? "mario settings_value" : "street settings_value") }><p>{ map === 1 ? "space" : "mario" }</p></div>
					<Arrow direction="down" state={ "active"  } click={ updateMap }/>
				</div>
			</div>
			{/* <div>Send invitation</div> */}
		</div>
)}

export default GameCreation;