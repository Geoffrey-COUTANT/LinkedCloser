import React from "react";

function InputText({ onChange, value }) {
    return (
        <div className='flex mx-14 mb-14'>
            <input
                type="text"
                value={value}
                onChange={onChange}
                className="text-violet-300 font-bold border-white border-b-2 w-full bg-transparent outline-none text-2xl ::placeholder  pl-2 pb-1"
                placeholder="Réponse..."
            />
        </div>
    )
}

export default InputText;