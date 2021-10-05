import { useEffect } from 'react';
import axios from 'axios';

export function ChannelAdmin () {
	useEffect(() => {
		axios.get(`/channel/infos/1`)
		.then( res => {
			console.log("RES chan infos", res);
		})
		.catch (err => {
			console.log("Error:", err);
		})
	}, []);

	return <></>
}