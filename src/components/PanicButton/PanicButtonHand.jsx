import React from "react";

function PanicButtonHand({ openModal, buttonActive }) {
    return (
        <div className={`flex h-24 w-24 justify-center items-center rounded-full border-2 border-white ${buttonActive === "Hand" ? "bg-violet-400" : 'bg-violet-300 hover:border-4 hover:bg-violet-400'}`}>
            <button className='h-14 w-14 mb-2 pr-2' title="Click Here" onClick={() => openModal("Hand")}>
                <img src={require('../img/panic-button/hand.png')} alt="logo"/>
            </button>
        </div>
    )
}

export default PanicButtonHand;