import React, {useEffect, useRef, useState} from 'react';
import Chronometre from "../Chronometre/Chronometre";
import PanicButton from "../PanicButton/PanicButton";
import ModalClock from "../Modal/ModalClock";
import ModalDollar from "../Modal/ModalDollar";
import ModalHand from "../Modal/ModalHand";
import Intonation from "../Intonation/Intonation";
import starsEmoji from "../img/intonation-emoji/stars.png";
import reflectEmoji from "../img/intonation-emoji/to-reflect-on.png";
import secretEmoji from "../img/intonation-emoji/secret.png";
import obviousEmoji from "../img/intonation-emoji/obvious.png";
import InputText from "../InputText/InputText";
import axios from "axios";

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
    const [name, setName] = useState('');
    const [error, setError] = useState(null);

    const handleStartExchange = async () => {
        try {
            const response = await axios.post('http://localhost:5058/createUser', null, {
                params: { name }
            });
            console.log('User created:', response.data);
            localStorage.setItem('userId', response.data.id);
            onNext(response.data.id);
        } catch (error) {
            setError(error.response?.data?.message);
            console.error('There was an error creating the user!', error);
        }
    };
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
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <button onClick={handleStartExchange}
                                className='flex bg-gray-400/80 hover:bg-gray-500 text-white font-bold py-4 px-7 my-32 rounded-full text-lg'>DÉMARRER
                            L'ÉCHANGE<img className='h-5 w-5 ml-3 mt-0.5' src={require('../img/play.png')} alt="logo"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function QuizOnboardingStep3({userId, onNext, onPrev, time, formatTime}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");
    const [chronoBackground, setChronoBackground] = useState("");
    const [chronoTextColor, setChronoTextColor] = useState("");
    const [userName, setUserName] = useState('');

    const updateChronoBackground = (background) => {
        setChronoBackground(background);
    };

    const updateChronoTextColor = (textColor) => {
        setChronoTextColor(textColor);
    };

    const openModal = (type) => {
        setModalVisible(true);
        setButtonActive(type);
        setModalType(type);
        updateChronoBackground("rgba(75,85,99,0.5)");
        updateChronoTextColor("#FFFFFF");
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
    useEffect(() => {
        const getUser = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                console.error('No user ID found in local storage');
                return;
            }
            try {
                const response = await axios.get(`http://localhost:5058/users/${userId}`);
                setUserName(response.data.name);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur', error);
            }
        };
        getUser();
    }, []);

    return (
        <div className={`flex justify-items-center mr-24 z-10 ${modalVisible ? 'fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center pr-24' : ''}`}>
            <div className={`flex justify-center mx-16 z-50 ${modalVisible ? 'pr-2' : ''}`}>
                <PanicButton openModal={openModal} buttonActive={buttonActive}/> {/* augmenter taille horloge avec du css */}
            </div>
            <div className='flex justify-items-center'>
                <div className={`bg-gray-400/30 rounded-3xl ${modalVisible ? '' : 'border-4'} border-gray-500/25 backdrop-blur-sm pt-14`}>
                    <div className='mb-2.5 mx-10'>
                        <div className='flex flex-grow mr-96'>
                            <h1 className='text-4xl ml-3.5 mr-96 text-white font-bold'>PARTIE 1 : CRÉER LE CONTACT</h1>
                            <Chronometre chronoBackground={chronoBackground} chronoTextColor={chronoTextColor} formatTime={formatTime} time={time}/>
                        </div>
                        <div className='flex flex-col bg-gray-800/50 py-52 mt-16 rounded-2xl items-center'>
                            <div className='text-white'>
                                <div className='mx-3.5'>
                                    <h1 className='text-3xl font-bold'>Bonjour {userName} ! Comment allez-vous ?</h1>
                                    <h2 className='text-2xl mt-7 italic'>D'où est-ce que vous m'appelez ?</h2>
                                    {modalVisible && renderModal()}
                                </div>
                            </div>
                        </div>
                        <div className='mt-10 mb-8 grid grid-cols-6 gap-2'>
                            <Intonation image={starsEmoji} text={"enthousiaste"}/>
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

function QuizOnboardingStep4({handleHabitualClick, time, formatTime, onNext, onPrev}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");
    const [chronoBackground, setChronoBackground] = useState("");
    const [chronoTextColor, setChronoTextColor] = useState("");

    const updateChronoBackground = (background) => {
        setChronoBackground(background);
    };

    const updateChronoTextColor = (textColor) => {
        setChronoTextColor(textColor);
    };

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
    const choiceButtonClick = async (choice) => {
        try {
            const response = await fetch('http://localhost:5058/createInput', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: localStorage.getItem('userId'),
                    choice: choice,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to save choice');
            }
            const data = await response.json();
            console.log('Success:', data);
            if (choice === 'habitual') {
                handleHabitualClick();
            } else {
                onNext();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <div className={`flex justify-items-center mr-24 z-10 ${modalVisible ? 'fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center pr-24' : ''}`}>
            <div className={`flex justify-center mx-16 z-50 ${modalVisible ? 'pr-2' : ''}`}>
                <PanicButton openModal={openModal} buttonActive={buttonActive}/>
            </div>
            <div className='flex justify-items-center'>
                <div className={`bg-gray-400/30 rounded-3xl ${modalVisible ? '' : 'border-4'} border-gray-500/25 backdrop-blur-sm pt-14`}>
                    <div className='mb-2.5 mx-10'>
                        <div className='flex flex-grow mr-96'>
                            <h1 className='text-4xl ml-2 text-white font-bold'>PARTIE 2 : PRENDRE LE CONTRÔLE DE L’APPEL (1 / 2)</h1>
                            <Chronometre chronoBackground={chronoBackground} chronoTextColor={chronoTextColor} formatTime={formatTime} time={time}/>
                        </div>
                        <div className='flex flex-col bg-gray-800/50 py-44 mt-16 rounded-2xl items-center'>
                            <div className='text-white'>
                                <div className='mx-4'>
                                    <h1 className='text-3xl font-bold'>Ok, vous avez l’habitude de faire des appels
                                        stratégiques
                                        ou c’est la 1ère fois ? </h1>
                                    <div className='flex flex-grow justify-center items-center mt-16 space-x-28'>
                                        <button onClick={() => choiceButtonClick('firstTime')}
                                                className='flex bg-gray-400/80 hover:bg-gray-500 text-white font-bold py-4 px-7 rounded-full text-lg'>C’EST
                                            LA 1ÈRE FOIS<img className='h-5 w-5 ml-3 mt-0.5'
                                                             src={require('../img/play.png')}
                                                             alt="logo"/>
                                        </button>
                                        <button onClick={() => choiceButtonClick('habitual')}
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
                            <Intonation image={reflectEmoji} text={"ça m'instéresse vraiment"}/>
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

function QuizOnboardingStep5({onNext, onPrev, time, formatTime}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");
    const [chronoBackground, setChronoBackground] = useState("");
    const [chronoTextColor, setChronoTextColor] = useState("");

    const updateChronoBackground = (background) => {
        setChronoBackground(background);
    };

    const updateChronoTextColor = (textColor) => {
        setChronoTextColor(textColor);
    };

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
                            <Chronometre chronoBackground={chronoBackground} chronoTextColor={chronoTextColor} formatTime={formatTime} time={time}/>
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
                            <Intonation image={secretEmoji} text={"secret"}/>
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

function QuizOnboardingStep6({onNext, onPrev, handleHabitualClickReturn, time, formatTime}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");
    const [chronoBackground, setChronoBackground] = useState("");
    const [chronoTextColor, setChronoTextColor] = useState("");

    const updateChronoBackground = (background) => {
        setChronoBackground(background);
    };

    const updateChronoTextColor = (textColor) => {
        setChronoTextColor(textColor);
    };

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
                            <Chronometre chronoBackground={chronoBackground} chronoTextColor={chronoTextColor} formatTime={formatTime} time={time}/>
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
                            <Intonation image={secretEmoji} text={"secret"}/>
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

function QuizOnboardingStep7({onNext, onPrev, time, formatTime}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");
    const [chronoBackground, setChronoBackground] = useState("");
    const [chronoTextColor, setChronoTextColor] = useState("");
    const [userName, setUserName] = useState('');
    const [inputName, setInputName] = useState('');

    const updateChronoBackground = (background) => {
        setChronoBackground(background);
    };

    const updateChronoTextColor = (textColor) => {
        setChronoTextColor(textColor);
    };

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
    useEffect(() => {
        const getUser = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                console.error('No user ID found in local storage');
                return;
            }
            try {
                const response = await axios.get(`http://localhost:5058/users/${userId}`);
                setUserName(response.data.name);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur', error);
            }
        };
        getUser();
    }, []);

    const handleInputChange = (e) => {
        setInputName(e.target.value);
    };

    const handleSaveAndNext = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('No user ID found in local storage');
            return;
        }
        try {
            await axios.post('http://localhost:5058/createInput', null, {
                body: JSON.stringify({
                    input: inputName,
                    userId: localStorage.getItem('userId'),
                }),
            });
            console.log('Input saved successfully');
            onNext();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'input', error);
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
                            <div className='flex mr-3'>
                                <h1 className='text-4xl ml-2 mr-80 text-white font-bold'>PARTIE 3 : POURQUOI LE PROSPECT ACCEPTE LE CALL ?</h1>
                            </div>
                            <Chronometre chronoBackground={chronoBackground} chronoTextColor={chronoTextColor} formatTime={formatTime} time={time}/>
                        </div>
                        <div className='flex flex-col bg-gray-800/50 mt-16 rounded-2xl'>
                            <div className='text-white mr-0.5 mt-2.5'>
                                <div className='ml-14 space-y-9 mt-16 mb-20'>
                                    {modalVisible && renderModal()}
                                    <h1 className='text-3xl font-bold'>Parfait, alors {userName} qu’est-ce qui vous à motifé à
                                        réservé cet appel ?</h1>
                                    <h1 className='text-2xl italic'>Depuis combien de temps faites vous ça ?</h1>
                                    <h1 className='text-2xl italic'>Pouvez-vous m’en dire plus sur X ?</h1>
                                    <h1 className='text-2xl italic'>Pourquoi pensez-vous que ce problème existe
                                        ?</h1>
                                </div>
                                <div className='pb-6'>
                                    <InputText onChange={handleInputChange}/>
                                </div>
                            </div>
                        </div>
                        <div className='mt-10 mb-8 grid grid-cols-6 gap-2'>
                            <Intonation image={reflectEmoji} text={"ça m'instéresse vraiment"}/>
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
                                    <button onClick={handleSaveAndNext}
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

function QuizOnboardingStep8({onNext, onPrev, time, formatTime}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");
    const [chronoBackground, setChronoBackground] = useState("");
    const [chronoTextColor, setChronoTextColor] = useState("");
    const [inputName, setInputName] = useState('');

    const updateChronoBackground = (background) => {
        setChronoBackground(background);
    };

    const updateChronoTextColor = (textColor) => {
        setChronoTextColor(textColor);
    };

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
    const handleInputChange = (e) => {
        setInputName(e.target.value);
    };

    const handleSaveAndNext = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('No user ID found in local storage');
            return;
        }
        try {
            await axios.post('http://localhost:5058/createInput', null, {
                params: {
                    input: inputName,
                    userId: userId
                }
            });
            console.log('Input saved successfully');
            onNext();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'input', error);
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
                            <Chronometre chronoBackground={chronoBackground} chronoTextColor={chronoTextColor} formatTime={formatTime} time={time}/>
                        </div>
                        <div className='flex flex-col left-0 bg-gray-800/50 max-w-full mt-16 rounded-2xl' style={{ width: '1302px'}}>
                            <div className='text-white mt-2.5'>
                                <div className='ml-14 space-y-9 mt-16 mb-20'> {/* Augmenter la width ! */}
                                    {modalVisible && renderModal()}
                                    <h1 className='text-3xl font-bold'>Concrètement, que vendez vous ?</h1>
                                    <div className='flex flex-col mr-64 space-y-9'>
                                        <h1 className='text-2xl italic'>À combien le vendez-vous ?</h1>
                                        <h1 className='text-2xl italic'>À qui le vendez-vous ?</h1>
                                        <h1 className='text-2xl italic'>Combien de Chiffres d’affaires faites vous
                                            ?</h1>
                                    </div>
                                </div>
                                <div className='pb-6'>
                                    <InputText onChange={handleInputChange}/>
                                </div>
                            </div>
                        </div>
                        <div className='mt-10 mb-8 grid grid-cols-6 gap-2'>
                            <Intonation image={reflectEmoji} text={"ça m'instéresse vraiment"}/>
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
                                    <button onClick={handleSaveAndNext}
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

function QuizOnboardingStep9({onNext, onPrev, time, formatTime}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");
    const [chronoBackground, setChronoBackground] = useState("");
    const [chronoTextColor, setChronoTextColor] = useState("");
    const [inputName, setInputName] = useState('');

    const updateChronoBackground = (background) => {
        setChronoBackground(background);
    };

    const updateChronoTextColor = (textColor) => {
        setChronoTextColor(textColor);
    };

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
    const handleInputChange = (e) => {
        setInputName(e.target.value);
    };

    const handleSaveAndNext = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('No user ID found in local storage');
            return;
        }
        try {
            await axios.post('http://localhost:5058/createInput', null, {
                params: {
                    input: inputName,
                    userId: userId
                }
            });
            console.log('Input saved successfully');
            onNext();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'input', error);
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
                            <h1 className='text-4xl ml-2 text-white font-bold'>PARTIE 5 : </h1>
                            <h1 className='text-2xl ml-4 mt-1 text-white font-bold'>POURQUOI SA SITUATION ACTUELLE NE LUI CONVIENT PLUS ?</h1>
                            <Chronometre chronoBackground={chronoBackground} chronoTextColor={chronoTextColor} formatTime={formatTime} time={time}/>
                        </div>
                        <div className='flex flex-col left-0 bg-gray-800/50 max-w-full mt-16 rounded-2xl'>
                            <div className='text-white mr-1'>
                                <div className='mr-12 pt-3.5'>
                                    <div className='ml-14 mr-80 space-y-9 mt-16'>
                                        {modalVisible && renderModal()}
                                        <h1 className='text-3xl font-bold'>Est-ce que cette façon d’obtenir vos clients vous
                                            convient ?</h1>
                                        <h1 className='text-2xl italic'>Quels sont les processus que vous avez en place pour
                                            attirer des clients ?</h1>
                                        <h1 className='text-2xl italic'>Combien cela vous coûte aujourd’hui d’obtenir un
                                            client ?</h1>
                                    </div>
                                </div>
                                <div className='mb-24 mt-32'>
                                    <InputText onChange={handleInputChange}/>
                                </div>
                            </div>
                        </div>
                        <div className='mt-10 mb-8 grid grid-cols-6 gap-2'>
                            <Intonation image={reflectEmoji} text={"ça m'instéresse vraiment"}/>
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
                                    <button onClick={handleSaveAndNext}
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

function QuizOnboardingStep10({onNext, onPrev, time, formatTime}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");
    const [chronoBackground, setChronoBackground] = useState("");
    const [chronoTextColor, setChronoTextColor] = useState("");
    const [userName, setUserName] = useState('');
    const [inputName, setInputName] = useState('');

    const updateChronoBackground = (background) => {
        setChronoBackground(background);
    };

    const updateChronoTextColor = (textColor) => {
        setChronoTextColor(textColor);
    };

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
    useEffect(() => {
        const getUser = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                console.error('No user ID found in local storage');
                return;
            }
            try {
                const response = await axios.get(`http://localhost:5058/users/${userId}`);
                setUserName(response.data.name);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur', error);
            }
        };
        getUser();
    }, []);
    const handleInputChange = (e) => {
        setInputName(e.target.value);
    };

    const handleSaveAndNext = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('No user ID found in local storage');
            return;
        }
        try {
            await axios.post('http://localhost:5058/createInput', null, {
                params: {
                    input: inputName,
                    userId: userId
                }
            });
            console.log('Input saved successfully');
            onNext();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'input', error);
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
                            <div className='flex mr-3.5'>
                                <div className='flex mr-16'>
                                    <h1 className='text-4xl ml-2 mr-96 text-white font-bold'>PARTIE 6 : QUELLE EST SA SITUATION DÉSIRÉE ?</h1>
                                </div>
                            </div>
                            <Chronometre chronoBackground={chronoBackground} chronoTextColor={chronoTextColor} formatTime={formatTime} time={time}/>
                        </div>
                        <div className='flex flex-col bg-gray-800/50 mt-16 pr-0.5 rounded-2xl'>
                            <div className='text-white mt-1.5 mr-24'>
                                <div className='ml-14 space-y-9 mt-12 mb-14'>
                                    {modalVisible && renderModal()}
                                    <h1 className='text-3xl font-bold'>Ok {userName}, quel est votre objectif financier d’ici 1 an ?</h1>
                                    <h1 className='text-2xl italic'>D’accord, qu’est-ce qui vous motive à atteindre ce chiffre précis ?</h1>
                                    <h1 className='text-2xl italic'>Qu’est-ce qui changerait pour vous si vous atteignez ces chiffres ?</h1>
                                    <h1 className='text-2xl italic'>Est-ce que vous avez des objecifs plus “émotionnel” ?</h1>
                                    <h1 className='text-2xl italic'>Qu’est-ce que cela changerait pour vous parvenez à l’atteindre ?</h1>
                                </div>
                                <InputText onChange={handleInputChange}/>
                            </div>
                        </div>
                        <div className='mt-10 mb-8 grid grid-cols-6 gap-2'>
                            <Intonation image={reflectEmoji} text={"ça m'instéresse vraiment"}/>
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
                                    <button onClick={handleSaveAndNext}
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

function QuizOnboardingStep11({onNext, onPrev, time, formatTime}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");
    const [chronoBackground, setChronoBackground] = useState("");
    const [chronoTextColor, setChronoTextColor] = useState("");
    const [userName, setUserName] = useState('');
    const [inputName, setInputName] = useState('');

    const updateChronoBackground = (background) => {
        setChronoBackground(background);
    };

    const updateChronoTextColor = (textColor) => {
        setChronoTextColor(textColor);
    };

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
    useEffect(() => {
        const getUser = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                console.error('No user ID found in local storage');
                return;
            }
            try {
                const response = await axios.get(`http://localhost:5058/users/${userId}`);
                setUserName(response.data.name);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur', error);
            }
        };
        getUser();
    }, []);
    const handleInputChange = (e) => {
        setInputName(e.target.value);
    };

    const handleSaveAndNext = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('No user ID found in local storage');
            return;
        }
        try {
            await axios.post('http://localhost:5058/createInput', null, {
                params: {
                    input: inputName,
                    userId: userId
                }
            });
            console.log('Input saved successfully');
            onNext();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'input', error);
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
                            <h1 className='text-4xl ml-2 text-white font-bold'>PARTIE 7 : FAITES LUI COMPRENDRE QU’IL A BESOIN DE VOUS ?</h1>
                            <Chronometre chronoBackground={chronoBackground} chronoTextColor={chronoTextColor} formatTime={formatTime} time={time}/>
                        </div>
                        <div className='flex flex-col bg-gray-800/50 mt-16 pr-0.5 rounded-2xl'>
                            <div className='text-white mr-7 mb-3.5'>
                                <div className='ml-14 mr-80 max-w-4xl left-0 space-y-20 mt-32 mb-28'>
                                    {modalVisible && renderModal()}
                                    <h1 className='text-3xl font-bold '>Ok {userName}, donc vous faites actuellement X € par
                                        mois et vous voulez en faire X €, aujourd’hui qu’est ce que vous en empêche
                                        aujourd’hui ?</h1>
                                </div>
                                <div className='pb-14'>
                                    <InputText onChange={handleInputChange}/>
                                </div>
                            </div>
                        </div>
                        <div className='mt-10 mb-8 grid grid-cols-6 gap-2'>
                            <Intonation image={reflectEmoji} text={"ça m'instéresse vraiment"}/>
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
                                    <button onClick={handleSaveAndNext}
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

function QuizOnboardingStep12({onNext, onPrev, time, formatTime}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");
    const [chronoBackground, setChronoBackground] = useState("");
    const [chronoTextColor, setChronoTextColor] = useState("");
    const [inputName, setInputName] = useState('');

    const updateChronoBackground = (background) => {
        setChronoBackground(background);
    };

    const updateChronoTextColor = (textColor) => {
        setChronoTextColor(textColor);
    };

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
    const handleInputChange = (e) => {
        setInputName(e.target.value);
    };

    const handleSaveAndNext = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('No user ID found in local storage');
            return;
        }
        try {
            await axios.post('http://localhost:5058/createInput', null, {
                params: {
                    input: inputName,
                    userId: userId
                }
            });
            console.log('Input saved successfully');
            onNext();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'input', error);
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
                            <h1 className='text-4xl ml-2 text-white font-bold'>PARTIE 8 : AGITEZ LE PROBLÈME ET CRÉER L’URGENCE ?</h1>
                            <Chronometre chronoBackground={chronoBackground} chronoTextColor={chronoTextColor} formatTime={formatTime} time={time}/>
                        </div>
                        <div className='flex flex-col bg-gray-800/50 mt-16 pr-0.5 rounded-2xl'>
                            <div className='text-white mr-0.5'>
                                <div className='mb-5 pt-1.5 mr-11'>
                                    <div className='ml-14 mr-80 max-w-6xl my-40'>
                                        {modalVisible && renderModal()}
                                        <h1 className='text-3xl font-bold mb-24'>Ok, et à partir de quand souhaitez vous atteindre ce seuil ?</h1>
                                    </div>
                                </div>
                                <div className='pb-14'>
                                    <InputText onChange={handleInputChange}/>
                                </div>
                            </div>
                        </div>
                        <div className='mt-10 mb-8 grid grid-cols-6 gap-2'>
                            <Intonation image={reflectEmoji} text={"ça m'instéresse vraiment"}/>
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
                                    <button onClick={handleSaveAndNext}
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

function QuizOnboardingStep13({onNext, onPrev, time, formatTime}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");
    const [chronoBackground, setChronoBackground] = useState("");
    const [chronoTextColor, setChronoTextColor] = useState("");
    const [userName, setUserName] = useState('');
    const [inputName, setInputName] = useState('');

    const updateChronoBackground = (background) => {
        setChronoBackground(background);
    };

    const updateChronoTextColor = (textColor) => {
        setChronoTextColor(textColor);
    };

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
    useEffect(() => {
        const getUser = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                console.error('No user ID found in local storage');
                return;
            }
            try {
                const response = await axios.get(`http://localhost:5058/users/${userId}`);
                setUserName(response.data.name);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur', error);
            }
        };
        getUser();
    }, []);
    const handleInputChange = (e) => {
        setInputName(e.target.value);
    };

    const handleSaveAndNext = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('No user ID found in local storage');
            return;
        }
        try {
            await axios.post('http://localhost:5058/createInput', null, {
                params: {
                    input: inputName,
                    userId: userId
                }
            });
            console.log('Input saved successfully');
            onNext();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'input', error);
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
                            <h1 className='text-4xl ml-2 text-white font-bold'>PARTIE 9 : DEMANDER LA PERMISSION DE VENDRE ?</h1>
                            <Chronometre chronoBackground={chronoBackground} chronoTextColor={chronoTextColor} formatTime={formatTime} time={time}/>
                        </div>
                        <div className='flex flex-col bg-gray-800/50 mt-16 pr-0.5 rounded-2xl items-center'>
                            <div className='text-white mb-2.5 mr-5'>
                                <div className='mx-16 max-w-6xl space-y-20 my-20'>
                                    {modalVisible && renderModal()}
                                    <h1 className='text-3xl font-bold'>Ok, merci {userName}, écoutez maintenant je suis sur
                                        que je peux
                                        vous accompagner...</h1>
                                    <h1 className='text-3xl font-bold'>Est-ce que vous voulez que je vous explique
                                        comment nous
                                        accompagnons nos clients ?</h1>
                                </div>
                                <div className='pb-6'>
                                    <InputText onChange={handleInputChange}/>
                                </div>
                            </div>
                        </div>
                        <div className='mt-10 mb-8 grid grid-cols-6 gap-2'>
                            <Intonation image={reflectEmoji} text={"ça m'instéresse vraiment"}/>
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
                                    <button onClick={handleSaveAndNext}
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

function QuizOnboardingStep14({onNext, onPrev, time, formatTime}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");
    const [chronoBackground, setChronoBackground] = useState("");
    const [chronoTextColor, setChronoTextColor] = useState("");

    const updateChronoBackground = (background) => {
        setChronoBackground(background);
    };

    const updateChronoTextColor = (textColor) => {
        setChronoTextColor(textColor);
    };

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
                            <h1 className='text-4xl ml-2 text-white font-bold'>PARTIE 10 : PRÉSENTATION DE VOTRE OFFRE : (1 / 2)</h1>
                            <Chronometre chronoBackground={chronoBackground} chronoTextColor={chronoTextColor} formatTime={formatTime} time={time}/>
                        </div>
                        <div className='flex flex-col bg-gray-800/50 mt-16 pr-0.5 rounded-2xl items-center'>
                            <div className='text-white mb-4 mr-5'>
                                <div className='mx-16 max-w-6xl my-44'>
                                    {modalVisible && renderModal()}
                                    <h1 className='text-3xl font-bold'>Ok, alors nous, nous accompagnons des coachs (tel que vous) à
                                        obtenir des clients grâce à Linkedin en mettant en place un
                                        processus qui ne vous demandera ni de passer 2h par jours à
                                        créer du contenu, ni dépenser des fortunes en publicités.</h1>
                                </div>
                            </div>
                        </div>
                        <div className='mt-10 mb-8 grid grid-cols-6 gap-2'>
                            <Intonation image={secretEmoji} text={"secret"}/>
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

function QuizOnboardingStep15({onNext, onPrev, time, formatTime}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");
    const [chronoBackground, setChronoBackground] = useState("");
    const [chronoTextColor, setChronoTextColor] = useState("");
    const [inputName, setInputName] = useState('');

    const updateChronoBackground = (background) => {
        setChronoBackground(background);
    };

    const updateChronoTextColor = (textColor) => {
        setChronoTextColor(textColor);
    };

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
    const handleInputChange = (e) => {
        setInputName(e.target.value);
    };

    const handleSaveAndNext = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('No user ID found in local storage');
            return;
        }
        try {
            await axios.post('http://localhost:5058/createInput', null, {
                params: {
                    input: inputName,
                    userId: userId
                }
            });
            console.log('Input saved successfully');
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'input', error);
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
                            <h1 className='text-4xl ml-2 text-white font-bold'>PARTIE 10 : PRÉSENTATION DE VOTRE OFFRE : (2 / 2)</h1>
                            <Chronometre chronoBackground={chronoBackground} chronoTextColor={chronoTextColor} formatTime={formatTime} time={time}/>
                        </div>
                        <div className='flex flex-col bg-gray-800/50 mt-16 rounded-2xl'>
                            <div className='text-white mb-0.5 mr-2'>
                                <div className='ml-14 mr-48 max-w-6xl space-y-32 mt-24 mb-24'>
                                    <div className='space-y-14'>
                                        {modalVisible && renderModal()}
                                        <h1 className='text-3xl font-bold'>Et si vous êtes partant on peut commencer dès
                                            la semaine
                                            prochaine !</h1>
                                        <h1 className='text-3xl font-bold'>Qu'en pensez-vous ?</h1>
                                    </div>
                                </div>
                                <div className='pb-24'>
                                    <InputText onChange={handleInputChange}/>
                                </div>
                            </div>
                        </div>
                        <div className='mt-10 mb-8 grid grid-cols-6 gap-2'>
                            <Intonation image={obviousEmoji} text={"c'est une évidence"}/>
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
                                    <div
                                        onClick={handleSaveAndNext}
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

function QuizOnboarding() {
    const [step, setStep] = useState(1);

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

    const handleClickReturn = () => {
        setStep(step - 3);
    };


    const [time, setTime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(time => time + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };


    return (
        <div className='flex'>
            {step === 1 && <QuizOnboardingStep1 onNext={handleNext} onPrev={handlePrev}/>}
            {step === 2 && <QuizOnboardingStep2 onNext={handleNext} onPrev={handlePrev}/>}
            {step === 3 && <QuizOnboardingStep3 onNext={handleNext} onPrev={handlePrev} time={time} formatTime={formatTime}/>}
            {step === 4 && <QuizOnboardingStep4 onNext={handleNext} onPrev={handlePrev} handleHabitualClick={handleHabitualClick} time={time} formatTime={formatTime}/>}
            {step === 5 && <QuizOnboardingStep5 onNext={handleHabitualClick} onPrev={handlePrev} time={time} formatTime={formatTime}/>}
            {step === 6 && <QuizOnboardingStep6 onNext={handleNext} onPrev={handlePrev} handleHabitualClickReturn={handleHabitualClickReturn} time={time} formatTime={formatTime}/>}
            {step === 7 && <QuizOnboardingStep7 onNext={handleNext} onPrev={handleClickReturn} time={time} formatTime={formatTime}/>}
            {step === 8 && <QuizOnboardingStep8 onNext={handleNext} onPrev={handlePrev} time={time} formatTime={formatTime}/>}
            {step === 9 && <QuizOnboardingStep9 onNext={handleNext} onPrev={handlePrev} time={time} formatTime={formatTime}/>}
            {step === 10 && <QuizOnboardingStep10 onNext={handleNext} onPrev={handlePrev} time={time} formatTime={formatTime}/>}
            {step === 11 && <QuizOnboardingStep11 onNext={handleNext} onPrev={handlePrev} time={time} formatTime={formatTime}/>}
            {step === 12 && <QuizOnboardingStep12 onNext={handleNext} onPrev={handlePrev} time={time} formatTime={formatTime}/>}
            {step === 13 && <QuizOnboardingStep13 onNext={handleNext} onPrev={handlePrev} time={time} formatTime={formatTime}/>}
            {step === 14 && <QuizOnboardingStep14 onNext={handleNext} onPrev={handlePrev} time={time} formatTime={formatTime}/>}
            {step === 15 && <QuizOnboardingStep15 onNext={handleNext} onPrev={handlePrev} time={time} formatTime={formatTime}/>}
        </div>
    )
}

export default QuizOnboarding;