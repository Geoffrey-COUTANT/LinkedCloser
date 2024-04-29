import React from "react";

    function PanicButtonDollar({ openModal, buttonActive }) {
    return (
        <div className={`flex h-24 w-24 justify-center items-center rounded-full ${buttonActive === "Dollar" ? 'bg-green-400' : 'bg-purple-400 hover:bg-green-400'}`}>
            <button className='h-20 w-20' title="Click Here" onClick={() => openModal("Dollar")}>
                <img src={require('../img/panic-button/dollar.png')} alt="logo"/>
            </button>
        </div>
    )
}

export default PanicButtonDollar;