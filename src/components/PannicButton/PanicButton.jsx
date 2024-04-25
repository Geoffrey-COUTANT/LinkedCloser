import React, {useState} from "react";

function PanicButton({openModal}) {
    return (
    <div className='flex items-center justify-center bg-gray-400/30 rounded-3xl border-4 border-gray-500/25 backdrop-blur-sm py-10 px-3 w-32 my-48'>
        <div className="absolute top-20 left-0 right-0 bottom-20 flex justify-center items-center">
            <div className="h-full bg-white w-10"></div>
        </div>
        <div className='flex flex-col relative space-y-7'>
            <div className='flex h-24 w-24 bg-pink-300 hover:bg-green-400 justify-center items-center rounded-full'>
                <button className='h-20 w-20' title="Click Here" onClick={openModal} >
                    <img src={require('../img/panic-button/clock.png')} alt="logo" />
                </button>
            </div>
            <div className='flex h-24 w-24 bg-pink-300 hover:bg-green-400 justify-center items-center rounded-full'>
                <button className='h-20 w-20' title="Click Here">
                    <img src={require('../img/panic-button/dollar.png')} alt="logo" />
                </button>
            </div>
            <div className='flex h-24 w-24 bg-pink-300 hover:bg-green-400 rounded-full'>
                <button className='h-20 w-20 pl-2 pt-3' title="Click Here">
                    <img src={require('../img/panic-button/hand.png')} alt="logo" />
                </button>
            </div>
        </div>
    </div>
);
}

export default PanicButton;