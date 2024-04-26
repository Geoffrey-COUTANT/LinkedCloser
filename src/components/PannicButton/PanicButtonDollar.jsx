import React from "react";

function PanicButtonDollar({ openModal }) {
    return (
        <div className='flex h-24 w-24 bg-pink-300 hover:bg-green-400 justify-center items-center rounded-full'>
            <button className='h-20 w-20' title="Click Here" onClick={() => openModal("Hand")}>
                <img src={require('../img/panic-button/dollar.png')} alt="logo"/>
            </button>
        </div>
    )
}

export default PanicButtonDollar;