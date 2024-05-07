import React from "react";

function Intonation({ text, image }) {
    return (
        <div className='flex flex-col col-start-1 col-end-3'>
            <div className='flex items-center bg-blue-950/20 text-white rounded-full w-80'>
                <img className='h-14 w-24 my-5 ml-1'
                     src={image}
                     alt="logo"/>Prenez une intonation : <br />"{text}"
            </div>
        </div>
    );
}

export default Intonation;