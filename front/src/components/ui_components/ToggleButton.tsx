import React from 'react';

type ToggleButtonProps = {
	direction: string,
	// click: (dir:string) => void
}

export function ToggleButton({ direction} : ToggleButtonProps) {
	
	const up = <svg className="toggle_button" xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 15 25" shape-rendering="crispEdges">
					<metadata>Made with Pixels to Svg https://codepen.io/shshaw/pen/XbxvNj</metadata>
					<path stroke="#ffcd27" d="M2 0h11M1 1h1M13 1h1M0 2h1M14 2h1M0 3h1M14 3h1M0 4h1M14 4h1M0 5h1M14 5h1M0 6h1M14 6h1M0 7h1M14 7h1M0 8h1M14 8h1M0 9h1M14 9h1M0 10h1M14 10h1M0 11h1M14 11h1M0 12h15M0 13h1M14 13h1M0 14h1M14 14h1M0 15h1M14 15h1M0 16h1M14 16h1M0 17h1M14 17h1M0 18h1M14 18h1M0 19h1M14 19h1M0 20h1M14 20h1M0 21h1M14 21h1M0 22h1M14 22h1M1 23h1M13 23h1M2 24h11" />
					<path  stroke="#ffcd27" d="M2 0h11M1 1h13M0 2h15M0 3h15M0 4h15M0 5h15M0 6h15M0 7h15M0 8h15M0 9h15M0 10h15M0 11h15" />
				</svg>

	const down = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 15 25" shape-rendering="crispEdges">
					<metadata>Made with Pixels to Svg https://codepen.io/shshaw/pen/XbxvNj</metadata>
					<path stroke="#ffcd27" d="M2 0h11M1 1h1M13 1h1M0 2h1M14 2h1M0 3h1M14 3h1M0 4h1M14 4h1M0 5h1M14 5h1M0 6h1M14 6h1M0 7h1M14 7h1M0 8h1M14 8h1M0 9h1M14 9h1M0 10h1M14 10h1M0 11h1M14 11h1M0 12h15M0 13h1M14 13h1M0 14h1M14 14h1M0 15h1M14 15h1M0 16h1M14 16h1M0 17h1M14 17h1M0 18h1M14 18h1M0 19h1M14 19h1M0 20h1M14 20h1M0 21h1M14 21h1M0 22h1M14 22h1M1 23h1M13 23h1M2 24h11" />
					<path  stroke="#ffcd27" d="M0 12h15M0 13h15M0 14h15M0 15h15M0 16h15M0 17h15M0 18h15M0 19h15M0 20h15M0 21h15M0 22h15M1 23h13M2 24h11" />
				</svg>

	return (
		<> { direction === "up" ? up : down } </>
	)
}