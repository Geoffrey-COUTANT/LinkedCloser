import React from "react";

function PanicbuttonClock({ openModal, buttonActive }) {
    return (
        <div className={`flex h-24 w-24 justify-center items-center rounded-full ${buttonActive === "Clock" ? 'bg-green-400' : 'bg-purple-900 hover:bg-green-400'} `}>
            <button className='h-20 w-20' title="Click Here" onClick={() => openModal("Clock")}>
                <img src={require('../img/panic-button/clock.png')} alt="logo"/>
            </button>
        </div>
    )
}

export default PanicbuttonClock;