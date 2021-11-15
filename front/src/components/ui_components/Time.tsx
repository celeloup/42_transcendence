import React, { useState, useEffect } from 'react';

export default function Time() {
    const [ time, setTime ] = useState<string>("");
    
    function showTime(){
        var date = new Date();
        var h = date.getHours(); // 0 - 23
        var m = date.getMinutes(); // 0 - 59
        
        var h2 = (h < 10) ? "0" + h : h;
        var m2 = (m < 10) ? "0" + m : m;
        
        var time = h2 + ":" + m2;
        
        setTime(time);
        const clearID: any = setTimeout(showTime, 1000);
        return clearID;
    }

    useEffect(() => {
        let clean: any = -1;

        clean = showTime();
        
        return () => {
            if (clean !== -1)
                clearTimeout(clean);
        };
    }, []) // eslint-disable-line
    
    return (
        <div id="time">
            <div>{ time }</div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 29 22" shapeRendering="crispEdges">
                <path stroke="#ffffff" d="M1 0h6M22 0h6M0 1h1M28 1h1M0 2h1M3 2h23M28 2h1M0 3h1M2 3h1M26 3h1M28 3h1M0 4h1M2 4h1M26 4h1M28 4h1M0 5h1M2 5h1M26 5h1M28 5h1M0 6h1M2 6h1M26 6h1M28 6h1M0 7h1M2 7h1M26 7h1M28 7h1M0 8h1M2 8h1M26 8h1M28 8h1M0 9h1M2 9h1M26 9h1M28 9h1M0 10h1M2 10h1M26 10h1M28 10h1M0 11h1M2 11h1M26 11h1M28 11h1M0 12h1M2 12h25M28 12h1M0 13h1M2 13h1M26 13h1M28 13h1M0 14h1M2 14h1M5 14h2M9 14h2M12 14h2M15 14h10M26 14h1M28 14h1M0 15h1M2 15h1M4 15h1M7 15h1M10 15h1M15 15h6M24 15h1M26 15h1M28 15h1M0 16h1M2 16h1M4 16h1M7 16h1M10 16h1M15 16h6M24 16h1M26 16h1M28 16h1M0 17h1M2 17h1M5 17h2M9 17h2M12 17h2M15 17h10M26 17h1M28 17h1M0 18h1M2 18h1M26 18h1M28 18h1M0 19h1M3 19h23M28 19h1M0 20h1M28 20h1M1 21h6M22 21h6" />
            </svg>
        </div>
	)
}