import React, { useState, useEffect } from "react";

function Chronometre() {
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
        <div className='text-3xl bg-blue-950/20 text-white px-16 py-2 rounded-xl ml-96'>
            <h1>{formatTime(time)}</h1>
        </div>
    );
}

export default Chronometre;