import React, { useState, useEffect } from "react";

function Chronometre({ chronoBackground }) {
    const [time, setTime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(time => time + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    return (
        <div style={{ backgroundColor: chronoBackground }} className='fixed top-0 right-0 bg-blue-950/20 text-white h-14 w-44 mt-32 px-14 mr-56 py-2 rounded-xl z-50'>
            <h1 className='text-3xl'>{formatTime(time)}</h1>
        </div>
    );
}

export default Chronometre;