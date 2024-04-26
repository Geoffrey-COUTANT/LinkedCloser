import React from "react";

function PanicButtonHand({ openModal }) {
    return (
        <div className='flex h-24 w-24 bg-pink-300 hover:bg-green-400 rounded-full'>
            <button className='h-20 w-20 pl-2 pt-3' title="Click Here" onClick={() => openModal("Hand")}>
                <img src={require('../img/panic-button/hand.png')} alt="logo"/>
            </button>
        </div>
    )
}

export default PanicButtonHand;