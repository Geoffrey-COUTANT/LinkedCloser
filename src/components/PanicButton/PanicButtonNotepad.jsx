import React from "react";

function PanicButtonNotepad({ openModal, buttonActive }) {
    return (
        <div className={`flex h-24 w-24 items-center justify-center rounded-full border-2 border-white ${buttonActive === "Notepad" ? "bg-violet-400" : 'bg-violet-300 hover:border-4 hover:bg-violet-400'}`}>
            <button className='h-16 w-16' title="Click Here" onClick={() => openModal("Notepad")}>
                <img className='w-16 h-16' src={require('../img/block-note.png')} alt="logo"/>
            </button>
        </div>
    )
}

export default PanicButtonNotepad;