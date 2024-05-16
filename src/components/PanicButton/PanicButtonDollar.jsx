import React from "react";

function PanicButtonDollar({ openModal, buttonActive }) {
    return (
        <div className={`flex h-24 w-24 justify-center items-center rounded-full border-2 border-white ${buttonActive === "Dollar" ? "bg-violet-400" : 'bg-violet-300 hover:border-4 hover:bg-violet-400'}`}>
            <button className='h-20 w-20' title="Click Here" onClick={() => openModal("Dollar")}>
                <img src={require('../img/panic-button/dollar.png')} alt="logo"/>
            </button>
        </div>
    )
}

export default PanicButtonDollar;