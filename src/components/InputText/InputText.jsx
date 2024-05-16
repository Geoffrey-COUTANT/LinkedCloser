import React from "react";

function InputText() {
    return (
        <div className='flex mx-14 mb-14'>
            <input
                type="text"
                className="text-white border-white border-b-2 w-full bg-transparent outline-none text-2xl ::placeholder pl-2 pb-1"
                placeholder="Réponse..."
            />
        </div>
    )
}

export default InputText;