import React from 'react';

type ArrowProps = {
	direction: string,
	state: string,
	click: (dir:string) => void
}

export function Arrow({ direction, state, click } : ArrowProps) {

	const color = (state === "disabled") ? "#919191" : "#ffcd27";

	const up = <svg onClick={ () => click(direction) } className={ "settings_arrows " + state } xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 7 4" shapeRendering="crispEdges">
					<metadata>Made with Pixels to Svg https://codepen.io/shshaw/pen/XbxvNj</metadata>
					<path stroke={ color } d="M3 0h1M2 1h3M1 2h5M0 3h7" />
				</svg>
	
	const down = <svg onClick={ () => click(direction) } className={ "settings_arrows " + state } xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 7 4" shapeRendering="crispEdges">
					<metadata>Made with Pixels to Svg https://codepen.io/shshaw/pen/XbxvNj</metadata>
					<path stroke={ color } d="M0 0h7M1 1h5M2 2h3M3 3h1" />
				</svg>
	
	const left = <svg onClick={ () => click(direction) } className={ "settings_arrows " + state } xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 4 7" shapeRendering="crispEdges">
					<metadata>Made with Pixels to Svg https://codepen.io/shshaw/pen/XbxvNj</metadata>
					<path stroke={ color } d="M3 0h1M2 1h2M1 2h3M0 3h4M1 4h3M2 5h2M3 6h1" />
				</svg>
	
	const right = <svg onClick={ () => click(direction) } className={ "settings_arrows " + state } xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 4 7" shapeRendering="crispEdges">
					<metadata>Made with Pixels to Svg https://codepen.io/shshaw/pen/XbxvNj</metadata>
					<path stroke={ color } d="M0 0h1M0 1h2M0 2h3M0 3h4M0 4h3M0 5h2M0 6h1" />
				</svg>
	
	var arrow:JSX.Element;
	switch(direction)
	{
		case "up":
			arrow = up;
			break;
		case "down":
			arrow = down;
			break;
		case "left":
			arrow = left;
			break;
		default:
			arrow = right;
	}
	
	return (
		<> { arrow } </>
	)
}