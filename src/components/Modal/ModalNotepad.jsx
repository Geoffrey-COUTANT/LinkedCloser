import React from "react";

function ModalNotepad({ closeModal }) {
    return (
        <div className='fixed inset-0 flex items-center rounded-3xl justify-center bg-black/70 z-40'>
            <div className='bg-gray-500 mx-14 rounded-2xl relative border-4 border-gray-600/50'>
                <div className='mb-2.5 mx-16'>
                    <div className='flex flex-grow justify-center space-x-28'>
                        <h1 className='text-3xl font-bold'>Suivi de vos questions réponses</h1>
                    </div>
                    <div className='mt-6 mb-4 grid grid-cols-6 gap-2'>
                        <div className='col-end-11 col-span-2'>
                            <button onClick={closeModal}
                                    className='flex bg-gray-400/80 hover:bg-gray-400 text-white font-bold py-4 px-7 rounded-full text-lg'>FERMER
                                LE “CADRE” ET REVENIR AU SCRIPT
                                <img className='h-5 w-5 ml-3 mt-1'
                                     src={require('../img/croix.png')}
                                     alt="logo"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalNotepad;