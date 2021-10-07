// import React from 'react';
import '../../styles/UI.scss';

type Props = {
	w: string;
	h: string;
	children: JSX.Element;
	id?: string
}

function WindowBorder( { w, h, children, id }: Props) {
	return (
		<div id={ id ? id : "" } style={{ height: h, width: w }} className="window">
			<div className="border_div border_top"></div>
			<div className="border_div border_bottom"></div>
			<div className="border_div border_right"></div>
			<div className="border_div border_left"></div>
			<div>
				{ children }
			</div>
		</div>
	)
}

export default WindowBorder;