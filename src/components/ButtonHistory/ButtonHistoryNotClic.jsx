import React from "react";

function ButtonHistoryNotClic({ number }) {
    return (
        <div className='flex flex-grow space-x-10'>
            <div className='flex items-center bg-gray-300/50 rounded-full p-2'>
                <img className='h-4 w-4 pl-1'
                     src={require('../img/play.png')}
                     alt="logo"/>
            </div>
            <div className='flex rounded-full justify-center px-5 items-center'>
                <div className='text-xl'>Histoire {number}</div>
            </div>
        </div>
    )
}

export default ButtonHistoryNotClic;