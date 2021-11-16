import React, { useEffect, useContext, useState } from 'react';
import { AuthContext, ContextType as AuthContextType } from '../../contexts/AuthContext';
import axios from "axios";

export default function Fusibles() {

    const { masterSocket } = useContext(AuthContext) as AuthContextType;
    const [ online, setOnline ] = useState<number>(0);
    const [ users, setUsers ] = useState<number>(0);

    useEffect(() => {
        axios.get("/users")
		.then(response => { 
            setUsers(response.data.length); 
            // console.log("all :", response.data.length)
        })
		.catch(error => { console.log(error.response); });

		masterSocket?.emit("get_users");
		masterSocket?.on("connected_users", (data : any) => {
            setOnline(data.length);
            // console.log("conntected:", data.length)
        });
        masterSocket?.on("update_online_users", (data: any) => {
            // console.log("update online:", data);
            setOnline(data.length);
        })
    },[masterSocket]);

    const white = "#ffffff";
    const gray = "#595959";
    
    return (
        <div id="fusibles">
            { [...Array(8)].map((e, i) =>
                <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 3 14" shapeRendering="crispEdges" className="fusibles_svg">
                    <path stroke={ Math.floor(online * 8 / users) > i ? white : gray } d="M1 0h1M0 1h3M0 2h3M0 3h3M0 4h3M0 5h3M0 6h3M0 7h3M0 8h3M0 9h3M0 10h3M0 11h3M0 12h3M1 13h1" />
                </svg>) }
        </div>
	)
}