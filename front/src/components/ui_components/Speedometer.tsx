import React from 'react';

type SpeedometerProps = {
	speed: number,
	// click: (dir:string) => void
}

export function Speedometer({ speed } : SpeedometerProps) {
	return (
		<svg className="speedometer" xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 21 11" shape-rendering="crispEdges">
			<metadata>Made with Pixels to Svg https://codepen.io/shshaw/pen/XbxvNj</metadata>
			<path stroke="#ffcd27" d="M7 0h7M5 1h2M14 1h2M4 2h1M16 2h1M3 3h2M16 3h2M2 4h1M5 4h1M15 4h1M18 4h1M1 5h1M6 5h1M14 5h1M19 5h1M1 6h1M19 6h1M0 7h1M20 7h1M0 8h1M20 8h1M0 9h1M20 9h1M0 10h5M16 10h5" />
			{ speed === 1 && <path stroke="#ffffff" d="M10 3h1M10 4h1M10 5h1M10 6h1M10 7h1M10 8h1M9 9h3M9 10h3M9 11h3" />}
			{ speed === 2 && <path stroke="#ffffff" d="M16 7h2M14 8h2M9 9h5M9 10h3M9 11h3" /> }
			{ speed === 0 && <path stroke="#ffffff" d="M3 7h2M5 8h2M7 9h5M9 10h3M9 11h3" /> }
		</svg>
	)
}