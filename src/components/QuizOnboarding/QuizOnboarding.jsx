import React, {useEffect, useRef, useState} from 'react';
import Chronometre from "../Chronometre/Chronometre";
import PanicButton from "../PannicButton/PanicButton";
import ModalClock from "../Modal/ModalClock";
import ModalDollar from "../Modal/ModalDollar";
import ModalHand from "../Modal/ModalHand";

function QuizOnboardingStep1({onNext, onPrev}) {
    const buttonRef = useRef(null);

    useEffect(() => {
        const button = buttonRef.current;

        const pulseAnimation = keyframes => {
            const animationName = `pulse-${Math.random().toString(36).substring(7)}`;
            const styleSheet = document.styleSheets[0];
            const keyframesRule = `@keyframes ${animationName} {
        ${keyframes}
      }`;

            styleSheet.insertRule(keyframesRule, styleSheet.cssRules.length);
            return animationName;
        };

        const animationName = pulseAnimation(`
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    `);
        button.style.animation = `${animationName} 2s infinite`;

        return () => {
            const styleSheet = document.styleSheets[0];
            const rules = styleSheet.cssRules;
            for (let i = 0; i < rules.length; i++) {
                if (rules[i].name === animationName) {
                    styleSheet.deleteRule(i);
                    break;
                }
            }
        };
    }, []);
    return (
        <div className='flex justify-center items-center'>
            <div className='bg-gray-400/30 px-80 py-8 rounded-3xl border-4 border-gray-500/25 backdrop-blur-sm '>
                <div className='flex flex-col justify-center items-center mt-10'>
                    <h1 className='text-5xl text-white font-bold'>Démarrer l'Appel !</h1>
                    <div className='my-48 mx-96 rounded-full'>
                        <div ref={buttonRef} className='rounded-full overflow-hidden'>
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
            <div className='bg-gray-400/30 rounded-3xl border-4 border-gray-500/25 backdrop-blur-sm py-20'>
                <div className='mb-6'>
                    <div className='flex flex-col justify-center items-center mt-28 mx-96'>
                        <h1 className='text-5xl mx-3.5 text-white font-bold'>Quel est le prénom de votre prospect ?</h1>
                        <input
                            type="text"
                            className="text-white border-white border-b-2 w-full bg-transparent outline-none text-4xl mt-36 ::placeholder pl-2 pb-1"
                            placeholder="Réponse..."
                        />
                        <button onClick={onNext}
                                className='flex bg-gray-400/80 hover:bg-gray-500 text-white font-bold py-4 px-7 my-32 rounded-full text-lg'>DÉMARRER
                            L'ÉCHANGE<img className='h-5 w-5 ml-3 mt-0.5' src={require('../img/play.png')} alt="logo"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function QuizOnboardingStep3({onNext, updateChronoBackground, updateChronoTextColor, onPrev}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");

    const openModal = (type) => {
        setModalVisible(true);
        setButtonActive(type);
        setModalType(type);
        updateChronoBackground("#FFFFFF");
        updateChronoTextColor("#000000");
    };

    const closeModal = () => {
        setModalVisible(false);
        setButtonActive("");
        setModalType("");
        updateChronoBackground("");
        updateChronoTextColor("");
    };

    const renderModal = () => {
        switch (modalType) {
            case "Clock":
                return <ModalClock closeModal={closeModal}/>;
            case "Dollar":
                return <ModalDollar closeModal={closeModal}/>;
            case "Hand":
                return <ModalHand closeModal={closeModal}/>;
            default:
                return null;
        }
    };
    return (
        <div className={`flex justify-items-center mr-24 z-10 ${modalVisible ? 'fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center pr-24' : ''}`}>
            <div className='flex justify-center mx-16 z-50'>
                <PanicButton openModal={openModal} buttonActive={buttonActive}/>  {/*faire en sorte que la pop-up face moins attaché a la page de derrière */}
            </div>
            <div className='flex justify-items-center'>
                <div className={`bg-gray-400/30 rounded-3xl ${modalVisible ? '' : 'border-4'} border-gray-500/25 backdrop-blur-sm pt-14`}>
                    <div className='mb-2.5 mx-10'>
                        <div className='flex flex-grow mr-96'>
                            <h1 className='text-4xl ml-3.5 mr-96 text-white font-bold'>PARTIE 1 : CRÉER LE CONTACT</h1>
                        </div>
                        <div className='flex flex-col bg-gray-800/50 py-52 mt-16 rounded-2xl items-center'>
                            <div className='text-white'>
                                <div className='mx-3.5'>
                                    <h1 className='text-3xl font-bold'>Bonjour John ! Comment allez-vous ?</h1>
                                    <h2 className='text-2xl mt-7'>D'où est-ce que vous m'appelez ?</h2>
                                    {modalVisible && renderModal()}
                                </div>
                            </div>
                        </div>
                        <div className='mt-10 mb-8 grid grid-cols-6 gap-2'>
                            <div className='flex flex-col col-start-1 col-end-3'>
                                <div className='flex items-center bg-blue-950/20 text-white rounded-full w-80'>
                                    <img className='h-12 w-20 my-5 ml-1'
                                         src={require('../img/intonation-emoji/stars.png')}
                                         alt="logo"/>Prenez une intonation "enthousiaste"
                                </div>
                            </div>
                            <div className='col-end-11 col-span-2'>
                                <button onClick={onNext}
                                        className='flex bg-gray-400/80 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full'>
                                    <img className='h-10 w-10 my-5 mr-3 ml-4' src={require('../img/play.png')}
                                         alt="logo"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function QuizOnboardingStep4({handleHabitualClick, updateChronoBackground, updateChronoTextColor ,onNext, onPrev}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");

    const openModal = (type) => {
        setModalVisible(true);
        setButtonActive(type);
        setModalType(type);
        updateChronoBackground("#FFFFFF");
        updateChronoTextColor("#000000");
    };

    const closeModal = () => {
        setModalVisible(false);
        setButtonActive("");
        setModalType("");
        updateChronoBackground("");
        updateChronoTextColor("");
    };

    const renderModal = () => {
        switch (modalType) {
            case "Clock":
                return <ModalClock closeModal={closeModal}/>;
            case "Dollar":
                return <ModalDollar closeModal={closeModal}/>;
            case "Hand":
                return <ModalHand closeModal={closeModal}/>;
            default:
                return null;
        }
    };
    return (
        <div className={`flex justify-items-center mr-24 z-10 ${modalVisible ? 'fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center pr-24' : ''}`}>
            <div className='flex justify-center mx-16 z-50'>
                <PanicButton openModal={openModal} buttonActive={buttonActive}/>
            </div>
            <div className='flex justify-items-center'>
                <div className={`bg-gray-400/30 rounded-3xl ${modalVisible ? '' : 'border-4'} border-gray-500/25 backdrop-blur-sm pt-14`}>
                    <div className='mb-2.5 mx-10'>
                        <div className='flex flex-grow mr-96'>
                            <h1 className='text-4xl ml-2 text-white font-bold'>PARTIE 2 : PRENDRE LE CONTRÔLE DE L’APPEL (1 / 2)</h1>
                        </div>
                        <div className='flex flex-col bg-gray-800/50 py-44 mt-16 rounded-2xl items-center'>
                            <div className='text-white'>
                                <div className='mx-4'>
                                    <h1 className='text-3xl font-bold'>Ok, vous avez l’habitude de faire des appels
                                        stratégiques
                                        ou c’est la 1ère fois ? </h1>
                                    <div className='flex flex-grow justify-center items-center mt-16 space-x-28'>
                                        <button onClick={onNext}
                                                className='flex bg-gray-400/80 hover:bg-gray-500 text-white font-bold py-4 px-7 rounded-full text-lg'>C’EST
                                            LA 1ÈRE FOIS<img className='h-5 w-5 ml-3 mt-0.5'
                                                             src={require('../img/play.png')}
                                                             alt="logo"/>
                                        </button>
                                        <button onClick={handleHabitualClick}
                                                className='flex bg-gray-400/80 hover:bg-gray-500 text-white font-bold py-4 px-7 rounded-full text-lg'>IL A DÉJÀ L’HABITUDE
                                            <img className='h-5 w-5 ml-3 mt-0.5'
                                                             src={require('../img/play.png')}
                                                             alt="logo"/>
                                        </button>
                                    </div>
                                    {modalVisible && renderModal()}
                                </div>
                            </div>
                        </div>
                        <div className='mt-10 mb-8 grid grid-cols-6 gap-2'>
                            <div className='flex flex-col col-start-1 col-end-3'>
                                <div className='flex items-center bg-blue-950/20 text-white rounded-full w-80'>
                                    <img className='h-12 w-20 my-5 ml-1'
                                         src={require('../img/intonation-emoji/stars.png')}
                                         alt="logo"/>Prenez une intonation "enthousiaste"
                                </div>
                            </div>
                            <div className='flex col-end-11 space-x-3 col-span-3'>
                                <div className='flex mt-6 justify-end'>
                                    <button onClick={onPrev}
                                        className='flex bg-gray-400/80 hover:bg-gray-500 text-white font-bold py-2.5 px-3 rounded-full'>
                                        <img className='h-5 w-5 my-4 mr-4 ml-3 rotate-180' src={require('../img/play.png')}
                                             alt="logo"/>
                                    </button>
                                </div>
                                <div>
                                    <div
                                        className='flex bg-gray-700/80 text-white font-bold py-2 px-4 rounded-full'>
                                        <img className='h-10 w-10 my-5 mr-3 ml-4' src={require('../img/play.png')}
                                             alt="logo"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function QuizOnboardingStep5({onNext, onPrev, updateChronoBackground, handleHabitualClick, updateChronoTextColor}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");

    const openModal = (type) => {
        setModalVisible(true);
        setButtonActive(type);
        setModalType(type);
        updateChronoBackground("#FFFFFF");
        updateChronoTextColor("#000000");
    };

    const closeModal = () => {
        setModalVisible(false);
        setButtonActive("");
        setModalType("");
        updateChronoBackground("");
        updateChronoTextColor("");
    };

    const renderModal = () => {
        switch (modalType) {
            case "Clock":
                return <ModalClock closeModal={closeModal}/>;
            case "Dollar":
                return <ModalDollar closeModal={closeModal}/>;
            case "Hand":
                return <ModalHand closeModal={closeModal}/>;
            default:
                return null;
        }
    };
    return (
        <div className={`flex justify-items-center mr-24 z-10 ${modalVisible ? 'fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center pr-24' : ''}`}>
            <div className='flex justify-center mx-16 z-50'>
                <PanicButton openModal={openModal} buttonActive={buttonActive}/>
            </div>
            <div className='flex justify-items-center'>
                <div className='bg-gray-400/30 rounded-3xl border-4 border-gray-500/25 backdrop-blur-sm pt-14'>
                    <div className='mb-2.5 mx-10'>
                        <div className='flex flex-grow'>
                            <h1 className='text-4xl ml-2 text-white font-bold'>PARTIE 2 : PRENDRE LE CONTRÔLE DE L’APPEL (2 / 2)</h1>
                        </div>
                        <div className='flex flex-col bg-gray-800/50 mt-16 rounded-2xl items-center'>
                            <div className='text-white ml-1.5'>
                                <div className='ml-12 mr-24 max-w-6xl space-y-14 mt-14 mb-24'>
                                    {modalVisible && renderModal()}
                                    <h1 className='text-2xl font-bold'>Et bien, écoutez je vais vous expliquez
                                        concrètement comment cet appel va se dérouler ... </h1>
                                    <h1 className='text-2xl font-bold '>Dans un 1er temps je vais vous poser quelques
                                        questions afin de comprendre ce que vous faites et ... voir si je peux vous aider,</h1>
                                    <h1 className='text-2xl font-bold '>et si jamais je vois que je peux, alors je vous expliquerai concrètement
                                        ce que j’ai à vous offrir, et vous pourez décider d’aller plus loin ou pas ...</h1>
                                    <h1 className='text-2xl font-bold'>Ça vous convient ? (première fois)</h1>
                                </div>
                            </div>
                        </div>
                        <div className='mt-10 mb-8 grid grid-cols-6 gap-2'>
                            <div className='flex flex-col col-start-1 col-end-3'>
                                <div className='flex items-center bg-blue-950/20 text-white rounded-full w-80'>
                                    <img className='h-12 w-20 my-5 ml-1'
                                         src={require('../img/intonation-emoji/stars.png')}
                                         alt="logo"/>Prenez une intonation "enthousiaste"
                                </div>
                            </div>
                            <div className='flex col-end-11 space-x-3 col-span-3'>
                                <div className='flex mt-6 justify-end'>
                                    <button onClick={onPrev}
                                            className='flex bg-gray-400/80 hover:bg-gray-500 text-white font-bold py-2.5 px-3 rounded-full'>
                                        <img className='h-5 w-5 my-4 mr-4 ml-3 rotate-180'
                                             src={require('../img/play.png')}
                                             alt="logo"/>
                                    </button>
                                </div>
                                <div>
                                    <button onClick={handleHabitualClick}
                                        className='flex bg-gray-400/80 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full'>
                                        <img className='h-10 w-10 my-5 mr-3 ml-4' src={require('../img/play.png')}
                                             alt="logo"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function QuizOnboardingStep6({onNext, onPrev, handleHabitualClickReturn, updateChronoBackground, updateChronoTextColor}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");

    const openModal = (type) => {
        setModalVisible(true);
        setButtonActive(type);
        setModalType(type);
        updateChronoBackground("#FFFFFF");
        updateChronoTextColor("#000000");
    };

    const closeModal = () => {
        setModalVisible(false);
        setButtonActive("");
        setModalType("");
        updateChronoBackground("");
        updateChronoTextColor("");
    };

    const renderModal = () => {
        switch (modalType) {
            case "Clock":
                return <ModalClock closeModal={closeModal}/>;
            case "Dollar":
                return <ModalDollar closeModal={closeModal}/>;
            case "Hand":
                return <ModalHand closeModal={closeModal}/>;
            default:
                return null;
        }
    };
    return (
        <div
            className={`flex justify-items-center mr-24 z-10 ${modalVisible ? 'fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center pr-24' : ''}`}>
            <div className='flex justify-center mx-16 z-50'>
                <PanicButton openModal={openModal} buttonActive={buttonActive}/>
            </div>
            <div className='flex justify-items-center'>
                <div className='bg-gray-400/30 rounded-3xl border-4 border-gray-500/25 backdrop-blur-sm pt-14'>
                    <div className='mb-2.5 mx-10'>
                        <div className='flex flex-grow'>
                            <h1 className='text-4xl ml-2 text-white font-bold'>PARTIE 2 : PRENDRE LE CONTRÔLE DE L’APPEL (2 / 2)</h1>
                        </div>
                        <div className='flex flex-col bg-gray-800/50 mt-16 rounded-2xl items-center'>
                            <div className='text-white ml-1.5'>
                                <div className='ml-12 mr-24 max-w-6xl space-y-14 mt-14 mb-24'>
                                    {modalVisible && renderModal()}
                                    <h1 className='text-2xl font-bold'>Et bien, écoutez je vais vous expliquez
                                        concrètement comment cet appel va se dérouler ... </h1>
                                    <h1 className='text-2xl font-bold '>Dans un 1er temps je vais vous poser quelques
                                        questions afin de comprendre ce que vous faites et ... voir si je peux vous aider,</h1>
                                    <h1 className='text-2xl font-bold '>et si jamais je vois que je peux, alors je vous expliquerai concrètement
                                        ce que j’ai à vous offrir, et vous pourez décider d’aller plus loin ou pas ...</h1>
                                    <h1 className='text-2xl font-bold'>Ça vous convient ? (il a l'habitude)</h1>
                                </div>
                            </div>
                        </div>
                        <div className='mt-10 mb-8 grid grid-cols-6 gap-2'>
                            <div className='flex flex-col col-start-1 col-end-3'>
                                <div className='flex items-center bg-blue-950/20 text-white rounded-full w-80'>
                                    <img className='h-12 w-20 my-5 ml-1'
                                         src={require('../img/intonation-emoji/stars.png')}
                                         alt="logo"/>Prenez une intonation "enthousiaste"
                                </div>
                            </div>
                            <div className='flex col-end-11 space-x-3 col-span-3'>
                                <div className='flex mt-6 justify-end'>
                                    <button onClick={handleHabitualClickReturn}
                                            className='flex bg-gray-400/80 hover:bg-gray-500 text-white font-bold py-2.5 px-3 rounded-full'>
                                        <img className='h-5 w-5 my-4 mr-4 ml-3 rotate-180'
                                             src={require('../img/play.png')}
                                             alt="logo"/>
                                    </button>
                                </div>
                                <div>
                                    <button onClick={onNext}
                                            className='flex bg-gray-400/80 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full'>
                                        <img className='h-10 w-10 my-5 mr-3 ml-4' src={require('../img/play.png')}
                                             alt="logo"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function QuizOnboardingStep7({onNext, onPrev, updateChronoBackground, updateChronoTextColor, handleHabitualClickReturn}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");

    const openModal = (type) => {
        setModalVisible(true);
        setButtonActive(type);
        setModalType(type);
        updateChronoBackground("#FFFFFF");
        updateChronoTextColor("#000000");
    };

    const closeModal = () => {
        setModalVisible(false);
        setButtonActive("");
        setModalType("");
        updateChronoBackground("");
        updateChronoTextColor("");
    };

    const renderModal = () => {
        switch (modalType) {
            case "Clock":
                return <ModalClock closeModal={closeModal}/>;
            case "Dollar":
                return <ModalDollar closeModal={closeModal}/>;
            case "Hand":
                return <ModalHand closeModal={closeModal}/>;
            default:
                return null;
        }
    };
    return (
        <div
            className={`flex justify-items-center mr-24 z-10 ${modalVisible ? 'fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center pr-24' : ''}`}>
            <div className='flex justify-center mx-16 z-50'>
                <PanicButton openModal={openModal} buttonActive={buttonActive}/>
            </div>
            <div className='flex justify-items-center'>
            <div className='bg-gray-400/30 rounded-3xl border-4 border-gray-500/25 backdrop-blur-sm pt-14'>
                    <div className='mb-2.5 mx-10'>
                        <div className='flex flex-grow'>
                            <h1 className='text-4xl ml-2 text-white font-bold'>PARTIE 3 : POURQUOI LE PROSPECT ACCEPTE LE CALL ?</h1>
                        </div>
                        <div className='flex flex-col bg-gray-800/50 mt-16 rounded-2xl items-center'>
                            <div className='text-white mr-0.5 mt-1.5'>
                                <div className='ml-14 mr-64 max-w-6xl space-y-12 mt-16 mb-20'>
                                    {modalVisible && renderModal()}
                                    <h1 className='text-3xl font-bold'>Parfait, alors John qu’est-ce qui vous à motifé à
                                        réservé cet appel ?</h1>
                                    <h1 className='text-2xl'>Depuis combien de temps faites vous ça ?</h1>
                                    <h1 className='text-2xl'>Pouvez-vous m’en dire plus sur X ?</h1>
                                    <h1 className='text-2xl'>Pourquoi pensez-vous que ce problème existe
                                        ?</h1>
                                    <input
                                        type="text"
                                        className="text-white border-white border-b-2 w-full bg-transparent outline-none text-2xl ::placeholder pl-2 pb-1"
                                        placeholder="Réponse..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='mt-10 mb-8 grid grid-cols-6 gap-2'>
                            <div className='flex flex-col col-start-1 col-end-3'>
                                <div className='flex items-center bg-blue-950/20 text-white rounded-full w-80'>
                                    <img className='h-12 w-20 my-5 ml-1'
                                         src={require('../img/intonation-emoji/stars.png')}
                                         alt="logo"/>Prenez une intonation "enthousiaste"
                                </div>
                            </div>
                            <div className='col-end-11 col-span-2'>
                                <button onClick={onNext}
                                        className='flex bg-gray-400/80 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full'>
                                    <img className='h-10 w-10 my-5 mr-3 ml-4' src={require('../img/play.png')}
                                         alt="logo"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function QuizOnboardingStep8({onNext, onPrev, updateChronoBackground, updateChronoTextColor, handleHabitualClickReturn}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");

    const openModal = (type) => {
        setModalVisible(true);
        setButtonActive(type);
        setModalType(type);
        updateChronoBackground("#FFFFFF");
        updateChronoTextColor("#000000");
    };

    const closeModal = () => {
        setModalVisible(false);
        setButtonActive("");
        setModalType("");
        updateChronoBackground("");
        updateChronoTextColor("");
    };

    const renderModal = () => {
        switch (modalType) {
            case "Clock":
                return <ModalClock closeModal={closeModal}/>;
            case "Dollar":
                return <ModalDollar closeModal={closeModal}/>;
            case "Hand":
                return <ModalHand closeModal={closeModal}/>;
            default:
                return null;
        }
    };
    return (
        <div
            className={`flex justify-items-center mr-24 z-10 ${modalVisible ? 'fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center pr-24' : ''}`}>
            <div className='flex justify-center mx-16 z-50'>
                <PanicButton openModal={openModal} buttonActive={buttonActive}/>
            </div>
            <div className='flex justify-items-center'>
                <div className='bg-gray-400/30 rounded-3xl border-4 border-gray-500/25 backdrop-blur-sm pt-14'>
                    <div className='mb-2.5 mx-10'>
                        <div className='flex flex-grow'>
                            <h1 className='text-4xl ml-2 text-white font-bold'>PARTIE 4 : QUELLE EST SA SITUATION ACTUELLE ?</h1>
                        </div>
                        <div className='flex flex-col bg-gray-800/50 mt-16 rounded-2xl items-center'>
                            <div className='text-white mt-1.5'>
                                <div className='ml-14 max-w-full space-y-12 mt-16 mb-20'> {/* Augmenter la width ! */}
                                    {modalVisible && renderModal()}
                                    <h1 className='text-3xl font-bold'>Concrètement, que vendez vous ?</h1>
                                    <h1 className='text-2xl'>À combien le vendez-vous ?</h1>
                                    <h1 className='text-2xl'>À qui le vendez-vous ?</h1>
                                    <h1 className='text-2xl'>Combien de Chiffres d’affaires faites vous ?</h1>
                                    <input
                                        type="text"
                                        className="text-white border-white border-b-2 right-0 w-full bg-transparent outline-none text-2xl ::placeholder pl-2 pb-1"
                                        placeholder="Réponse..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='mt-10 mb-8 grid grid-cols-6 gap-2'>
                            <div className='flex flex-col col-start-1 col-end-3'>
                                <div className='flex items-center bg-blue-950/20 text-white rounded-full w-80'>
                                    <img className='h-12 w-20 my-5 ml-1'
                                         src={require('../img/intonation-emoji/stars.png')}
                                         alt="logo"/>Prenez une intonation "enthousiaste"
                                </div>
                            </div>
                            <div className='col-end-11 col-span-2'>
                                <button onClick={onPrev}
                                        className='flex bg-gray-400/80 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full'>
                                    <img className='h-10 w-10 my-5 mr-3 ml-4' src={require('../img/play.png')}
                                         alt="logo"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function QuizOnboarding() {
    const [step, setStep] = useState(1);
    const [chronoBackground, setChronoBackground] = useState("");
    const [chronoTextColor, setChronoTextColor] = useState("");

    const handleNext = () => {
        setStep(step + 1);
    }

    const handlePrev = () => {
        setStep(step - 1);
    }

    const handleHabitualClick = () => {
        setStep(step + 2);
    };

    const handleHabitualClickReturn = () => {
        setStep(step - 2);
    };

    const updateChronoBackground = (background) => {
        setChronoBackground(background);
    };

    const updateChronoTextColor = (textColor) => {
        setChronoTextColor(textColor);
    };

    return (
        <div className='flex'>
            <div className='mr-3'>
                {step >= 3 ? <Chronometre chronoBackground={chronoBackground} chronoTextColor={chronoTextColor}/> : null}
            </div>
            {step === 1 && <QuizOnboardingStep1 onNext={handleNext} onPrev={handlePrev}/>}
            {step === 2 && <QuizOnboardingStep2 onNext={handleNext} onPrev={handlePrev} updateChronoBackground={updateChronoBackground} updateChronoTextColor={updateChronoTextColor}/>}
            {step === 3 && <QuizOnboardingStep3 onNext={handleNext} onPrev={handlePrev} updateChronoBackground={updateChronoBackground} updateChronoTextColor={updateChronoTextColor}/>}
            {step === 4 && <QuizOnboardingStep4 onNext={handleNext} onPrev={handlePrev} handleHabitualClick={handleHabitualClick} updateChronoBackground={updateChronoBackground} updateChronoTextColor={updateChronoTextColor}/>}
            {step === 5 && <QuizOnboardingStep5 onNext={handleNext} onPrev={handlePrev} handleHabitualClick={handleHabitualClick} updateChronoBackground={updateChronoBackground} updateChronoTextColor={updateChronoTextColor}/>}
            {step === 6 && <QuizOnboardingStep6 onNext={handleNext} onPrev={handlePrev} updateChronoBackground={updateChronoBackground} updateChronoTextColor={updateChronoTextColor} handleHabitualClickReturn={handleHabitualClickReturn}/>}
            {step === 7 && <QuizOnboardingStep7 onNext={handleNext} onPrev={handlePrev} handleHabitualClickReturn={handleHabitualClickReturn} updateChronoBackground={updateChronoBackground} updateChronoTextColor={updateChronoTextColor}/>}
            {step === 8 && <QuizOnboardingStep8 onNext={handleNext} onPrev={handlePrev} handleHabitualClickReturn={handleHabitualClickReturn} updateChronoBackground={updateChronoBackground} updateChronoTextColor={updateChronoTextColor}/>}
        </div>
    )
}

export default QuizOnboarding;