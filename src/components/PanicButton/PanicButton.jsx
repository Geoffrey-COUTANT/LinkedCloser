import React, {useState} from "react";
import PanicbuttonClock from "./PanicbuttonClock";
import PanicButtonDollar from "./PanicButtonDollar";
import PanicButtonHand from "./PanicButtonHand";
import PanicButtonNotepad from "./PanicButtonNotepad";

function PanicButton({ openModal, buttonActive, activeType }) {
    return (
    <div className='flex items-center justify-center bg-gray-400/30 rounded-3xl border-4 border-gray-500/25 backdrop-blur-sm py-10 px-3 w-32 my-36'>
        <div className="absolute top-0 left-0 right-0 bottom-24 flex justify-center items-center">
            <div className="h-64 bg-white w-10"></div>
        </div>
        <div className='flex flex-col relative'>
            <div className='flex flex-col space-y-7'>
            <PanicbuttonClock buttonActive={buttonActive} openModal={() => openModal("Clock")}/>
            <PanicButtonDollar buttonActive={buttonActive} openModal={() => openModal("Dollar")}/>
            <PanicButtonHand buttonActive={buttonActive} openModal={() => openModal("Hand")}/>
            </div>
            <div className='mt-16'>
                <PanicButtonNotepad buttonActive={buttonActive} openModal={() => openModal("Notepad")}/>
            </div>
        </div>
    </div>
);
}

export default PanicButton;