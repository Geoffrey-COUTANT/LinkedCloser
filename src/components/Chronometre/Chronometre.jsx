import React, { useState, useEffect } from "react";

function Chronometre({ chronoBackground, chronoTextColor, formatTime, time}) {

    return (
        <div style={{ backgroundColor: chronoBackground }} className='fixed top-0 right-0 bg-blue-950/20 text-white h-14 w-44 mt-12 px-14 mr-10 py-2 rounded-xl z-50'>
                <h1 style={{ color : chronoTextColor }} className='text-3xl'>{formatTime(time)}</h1>
        </div>
    );
}

export default Chronometre;