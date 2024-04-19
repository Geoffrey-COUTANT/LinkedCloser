import React, { useState } from 'react';

function QuizOnboardingStep1({onNext, onPrev}) {
    return (
        <div className='flex backdrop-blur-2px bg-gray-400/30 justify-center items-center'>
            <div className='flex flex-col justify-center items-center'>
                <h1 className='text-4xl text-white font-bold'>Démarrer l'Appel !</h1>
                <button onClick={onNext} className='bg-gray-300 hover:bg-gray-400'>Start Quiz</button>
            </div>
        </div>
    )
}

function QuizOnboardingStep2({onNext, onPrev}) {
    return (
        <div className='flex bg-gray-700 justify-center items-center'>
            <div className='flex flex-col justify-center items-center'>
                <h1 className='text-4xl text-white font-bold'>Question 1</h1>
                <p className='text-white'>What is React?</p>
                <button onClick={onPrev} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Next</button>
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
            {step === 1 && <QuizOnboardingStep1 onNext={handleNext} onPrev={handlePrev} />}
            {step === 2 && <QuizOnboardingStep2 onNext={handleNext} onPrev={handlePrev} />}
        </div>
    )
}

export default QuizOnboarding;