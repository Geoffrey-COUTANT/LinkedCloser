import React from "react";

function ModalClock({ closeModal }) {
    return (
        <div className='fixed inset-0 flex items-center rounded-3xl justify-center bg-black/70 z-40'>
            <div className='bg-gray-500 mx-14 rounded-2xl relative border-4 border-gray-600/50'>
                <div className='mb-2.5 mx-16'>
                    <div className='flex flex-grow space-x-28'>
                        <div className='flex flex-grow'>
                            <div className='flex flex-col bg-gray-800/30 mt-7 ml-8 rounded-2xl items-center'>
                                <div className='text-white '>
                                    <div className='mt-7 ml-9 mx-16'>
                                        <h1 className='text-lg'>LE PROSPECT VOUS DONNE UN CRÈNEAU QUI VOUS CONVIENT ?
                                            RÉPONDEZ :</h1>
                                        <h2 className='text-xl mt-7 font-bold'>Pas de soucis ! Je n’ai besoin que de X
                                            minute !</h2>
                                        <div className='flex flex-col col-start-1 col-end-3'>
                                            <div
                                                className='flex items-center bg-blue-950/20 text-white rounded-full mb-5 mt-28 w-64'>
                                                <img className='h-8 w-14 my-5 ml-1'
                                                     src={require('../img/intonation-emoji/stars.png')}
                                                     alt="logo"/>
                                                Prenez une intonation "enthousiaste"
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-grow space-x-5'>
                            <div className='flex flex-col bg-gray-800/30 mt-7 mr-8 rounded-2xl items-center'>
                                <div className='text-white '>
                                    <div className='mt-7 ml-9 mr-8'>
                                        <h1 className='text-lg'>LE PROSPECT VOUS DONNE UN CRÈNEAU
                                            TROP SÉRRÉ ? RÉPONDEZ :</h1>
                                        <h2 className='text-xl mt-7 font-bold'>Malheureusement en [ X minute ] je n’aurai
                                            pas assez de temps pour vous apporter
                                            suffisament de valeur,</h2>
                                        <h2 className='text-xl mt-4 font-bold'>Alors il faudrait mieux reporter l’échange.</h2>
                                        <h2 className='text-xl mt-4 font-bold'>Seriez vous plûtot disponible le X ou le X ?</h2>
                                        <div className='flex flex-col col-start-1 col-end-3'>
                                            <div
                                                className='flex items-center bg-blue-950/20 text-white rounded-full mb-5 mt-7 w-64'>
                                                <img className='h-8 w-14 my-5 ml-1'
                                                     src={require('../img/intonation-emoji/stars.png')}
                                                     alt="logo"/>
                                                Prenez une intonation "enthousiaste"
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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
    )
}

export default ModalClock;