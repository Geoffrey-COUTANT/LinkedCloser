import React, {useState} from "react";
import PanicbuttonClock from "./PanicbuttonClock";
import PanicButtonDollar from "./PanicButtonDollar";
import PanicButtonHand from "./PanicButtonHand";

function PanicButton({ openModal, buttonActive }) {
    return (
    <div className='flex items-center justify-center bg-gray-400/30 rounded-3xl border-4 border-gray-500/25 backdrop-blur-sm py-10 px-3 w-32 my-48'>
        <div className="absolute top-20 left-0 right-0 bottom-20 flex justify-center items-center">
            <div className="h-full bg-white w-10"></div>
        </div>
        <div className='flex flex-col relative space-y-7'>
            <PanicbuttonClock buttonActive={buttonActive} openModal={() => openModal("Clock")}/>
            <PanicButtonDollar buttonActive={buttonActive} openModal={() => openModal("Dollar")}/>
            <PanicButtonHand buttonActive={buttonActive} openModal={() => openModal("Hand")}/>
        </div>
    </div>
);
}

export default PanicButton;