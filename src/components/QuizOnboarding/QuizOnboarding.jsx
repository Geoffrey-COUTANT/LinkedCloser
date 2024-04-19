import React, { useState } from 'react';

function QuizOnboardingStep1({onNext, onPrev}) {
    return (
        <div className='flex justify-center items-center'>
            <div className='bg-gray-400/30 rounded-lg border-4 border-gray-500/25 backdrop-blur-sm '>
                <div className='flex flex-col justify-center items-center mt-10'>
                    <h1 className='text-4xl text-white font-bold'>Démarrer l'Appel !</h1>
                    <div className='my-48 mx-96 rounded-full'>
                        <div className='rounded-full overflow-hidden'>
                            <button onClick={onNext} className='bg-gray-300/50 hover:bg-gray-400'>
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
                <div className='flex flex-col justify-center items-center mt-40 mx-96'>
                    <h1 className='text-4xl text-white font-bold'>Quel est le prénom de votre prospect ?</h1>
                    <div className='mt-24 mx-96'></div>
                    <div className='w-96 h-0.5 bg-white'></div>
                    <button onClick={onPrev}
                            className='flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-14 mb-52 rounded-full'>DEMARRER
                        L'ECHANGE<img className='h-5 w-5 ml-3 mt-0.5' src={require('../img/play.png')} alt="logo"/>
                    </button>
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
        </div>
    )
}

export default QuizOnboarding;