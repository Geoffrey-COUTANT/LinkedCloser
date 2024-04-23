import React, { useState } from 'react';
import Chronometre from "../Chronometre/Chronometre";

function QuizOnboardingStep1({onNext, onPrev}) {
    return (
        <div className='flex justify-center items-center'>
            <div className='bg-gray-400/30 px-80 py-8 rounded-lg border-4 border-gray-500/25 backdrop-blur-sm '>
                <div className='flex flex-col justify-center items-center mt-10'>
                    <h1 className='text-4xl text-white font-bold'>Démarrer l'Appel !</h1>
                    <div className='my-48 mx-96 rounded-full'>
                        <div className='rounded-full overflow-hidden'>
                            <button onClick={onNext} className='bg-gray-300/50 hover:bg-gray-400 rounded-full'>
                                <img className='m-20' src={require('../img/logo-appel.png')} alt="logo"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function QuizOnboardingStep2({onNext, onPrev}) {
    return (
        <div className='flex justify-center items-center'>
            <div className='bg-gray-400/30 rounded-lg border-4 border-gray-500/25 backdrop-blur-sm py-24'>
                <div className='mb-2.5'>
                    <div className='flex flex-col justify-center items-center mt-28 mx-96'>
                        <h1 className='text-5xl mx-3.5 text-white font-bold'>Quel est le prénom de votre prospect ?</h1>
                        <input
                            type="text"
                            className="text-white border-white border-b-2 w-full bg-transparent outline-none text-4xl mt-36"
                            placeholder="Réponse..."
                        />
                        <button onClick={onNext}
                                className='flex bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 my-32 rounded-full'>DÉMARRER
                            L'ÉCHANGE<img className='h-5 w-5 ml-3 mt-0.5' src={require('../img/play.png')} alt="logo"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function QuizOnboardingStep3({onNext, onPrev}) {
    return (
        <div className='flex flex-col'>
            <div className='flex justify-items-center'>
                <div className='bg-gray-400/30 rounded-lg border-4 border-gray-500/25 backdrop-blur-sm pt-14'>
                    <div className='mb-2.5 mx-10'>
                        <div className='flex flex-grow '>
                            <h1 className='text-4xl ml-3.5 mr-96 text-white font-bold'>PARTIE 1 : CRÉER LE CONTACT</h1>
                            <Chronometre />
                        </div>
                        <div className='flex flex-col bg-gray-500/20 py-52 mt-16 rounded-lg items-center'>
                            <div className='text-white'>
                                <div className='mx-3.5'>
                                    <h1 className='text-3xl font-bold'>Bonjour John ! Comment allez-vous ?</h1>
                                    <h2 className='text-2xl mt-7'>D'où est-ce que vous m'appelez ?</h2>
                                </div>
                            </div>
                        </div>
                        <div className='mt-10 mb-8 grid grid-cols-6 gap-2'>
                            <div className='flex flex-col col-start-1 col-end-3'>
                                <div className='flex items-center bg-gray-600 rounded-full w-80'>
                                    <img className='h-12 w-20 my-5 ml-1' src={require('../img/intonation-emoji/stars.png')}
                                         alt="logo"/>Prenez une intonation "enthousiaste"
                                </div>
                            </div>
                            <div className='col-end-11 col-span-2'>
                                <button onClick={onPrev}
                                        className='flex bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full'>
                                    <img className='h-10 w-10 my-5 mx-3' src={require('../img/play.png')} alt="logo"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div>

                </div>
            </div>
        </div>
    )
}

function QuizOnboarding() {
    const [step, setStep] = useState(1);

    const handleNext = () => {
        setStep(step + 1);
    }

    const handlePrev = () => {
        setStep(step - 1);
    }

    return (
        <div className='flex justify-center items-center'>
            {step === 1 && <QuizOnboardingStep1 onNext={handleNext} onPrev={handlePrev}/>}
            {step === 2 && <QuizOnboardingStep2 onNext={handleNext} onPrev={handlePrev}/>}
            {step === 3 && <QuizOnboardingStep3 onNext={handleNext} onPrev={handlePrev}/>}
        </div>
    )
}

export default QuizOnboarding;