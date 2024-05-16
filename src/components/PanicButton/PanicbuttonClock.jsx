import React from "react";

function PanicbuttonClock({ openModal, buttonActive }) {
    return (
        <div className={`flex h-24 w-24 justify-center items-center rounded-full border-2 border-white ${buttonActive === "Clock" ? "bg-violet-400" : 'bg-violet-300 hover:border-4 hover:bg-violet-400'} `}>
            <button className='h-16 w-16' title="Click Here" onClick={() => openModal("Clock")}>
                <img src={require('../img/panic-button/clock.png')} alt="logo"/>
            </button>
        </div>
    )
}

export default PanicbuttonClock;