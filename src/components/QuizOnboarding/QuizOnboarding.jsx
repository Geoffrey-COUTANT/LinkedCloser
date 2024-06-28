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
import ModalNotepad from "../Modal/ModalNotepad";
import ButtonHistoryNotClic from "../ButtonHistory/ButtonHistoryNotClic";
import ModalHistory from "../ButtonHistory/ModalHistoryForYou/ModalHistory";

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
            case "Notepad":
                return <ModalNotepad closeModal={closeModal}/>;
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
                <PanicButton openModal={openModal} buttonActive={buttonActive}/>
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
    const [currentQuestionId, setCurrentQuestionId] = useState(0);

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
            case "Notepad":
                return <ModalNotepad closeModal={closeModal}/>;
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
                    questionId: currentQuestionId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to save choice');
            }
            const data = await response.json();
            console.log('Success:', data);
            if (choice === 'Il a l\'habitude de faire ce genre d\'appel') {
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
                                        <button onClick={() => choiceButtonClick('C\'est la première fois qu\'il fait ce genre d\'appel')}
                                                className='flex bg-gray-400/80 hover:bg-gray-500 text-white font-bold py-4 px-7 rounded-full text-lg'>C’EST
                                            LA 1ÈRE FOIS<img className='h-5 w-5 ml-3 mt-0.5'
                                                             src={require('../img/play.png')}
                                                             alt="logo"/>
                                        </button>
                                        <button onClick={() => choiceButtonClick('Il a l\'habitude de faire ce genre d\'appel')}
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
            case "Notepad":
                return <ModalNotepad closeModal={closeModal}/>;
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
            case "Notepad":
                return <ModalNotepad closeModal={closeModal}/>;
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
    const [currentQuestionId, setCurrentQuestionId] = useState(1);
    const [userId, setUserId] = useState(null);
    const [userInputs, setUserInputs] = useState({});

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
            case "Notepad":
                return <ModalNotepad closeModal={closeModal}/>;
            default:
                return null;
        }
    };

    useEffect(() => {
        const getUser = async () => {
            const storedUserId = localStorage.getItem('userId');
            if (!storedUserId) {
                console.error('No user ID found in local storage');
                return;
            }
            setUserId(storedUserId);
            try {
                const response = await axios.get(`http://localhost:5058/users/${storedUserId}`);
                setUserName(response.data.name);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur', error);
            }
        };
        getUser();
    }, []);

    const handleSaveAndNext = async () => {
        if (!userId) {
            console.error('No user ID found in local storage');
            return;
        }
        try {
            await axios.post('http://localhost:5058/createInput', {
                input: inputName,
                userId: parseInt(userId),
                questionId: currentQuestionId,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Input saved successfully');

            // Enregistrer l'entrée dans le stockage local
            const storedUserInputs = JSON.parse(localStorage.getItem('userInputs') || '{}');
            const userInputsForCurrentUser = storedUserInputs[userId] || {};
            userInputsForCurrentUser[currentQuestionId] = inputName;
            storedUserInputs[userId] = userInputsForCurrentUser;
            localStorage.setItem('userInputs', JSON.stringify(storedUserInputs));

            onNext();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'input', error);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputName(value);
        localStorage.setItem(`inputText-${currentQuestionId}`, value);
    };

    useEffect(() => {
        if (userId) {
            // Charger les entrées pour le userId actuel
            const storedUserInputs = JSON.parse(localStorage.getItem('userInputs') || '{}');
            const userInputsForCurrentUser = storedUserInputs[userId] || {};
            const storedInput = userInputsForCurrentUser[currentQuestionId] || '';
            setInputName(storedInput);
        }
    }, [userId, currentQuestionId]);
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
                                    <InputText value={inputName} onChange={handleInputChange}/>
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
    const [currentQuestionId, setCurrentQuestionId] = useState(2);
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState(null);
    const [userInputs, setUserInputs] = useState({});

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
            case "Notepad":
                return <ModalNotepad closeModal={closeModal}/>;
            default:
                return null;
        }
    };

    useEffect(() => {
        const getUser = async () => {
            const storedUserId = localStorage.getItem('userId');
            if (!storedUserId) {
                console.error('No user ID found in local storage');
                return;
            }
            setUserId(storedUserId);
            try {
                const response = await axios.get(`http://localhost:5058/users/${storedUserId}`);
                setUserName(response.data.name);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur', error);
            }
        };
        getUser();
    }, []);

    const handleSaveAndNext = async () => {
        if (!userId) {
            console.error('No user ID found in local storage');
            return;
        }
        try {
            await axios.post('http://localhost:5058/createInput', {
                input: inputName,
                userId: parseInt(userId),
                questionId: currentQuestionId,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Input saved successfully');

            // Enregistrer l'entrée dans le stockage local
            const storedUserInputs = JSON.parse(localStorage.getItem('userInputs') || '{}');
            const userInputsForCurrentUser = storedUserInputs[userId] || {};
            userInputsForCurrentUser[currentQuestionId] = inputName;
            storedUserInputs[userId] = userInputsForCurrentUser;
            localStorage.setItem('userInputs', JSON.stringify(storedUserInputs));

            onNext();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'input', error);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputName(value);
        localStorage.setItem(`inputText-${currentQuestionId}`, value);
    };

    useEffect(() => {
        if (userId) {
            // Charger les entrées pour le userId actuel
            const storedUserInputs = JSON.parse(localStorage.getItem('userInputs') || '{}');
            const userInputsForCurrentUser = storedUserInputs[userId] || {};
            const storedInput = userInputsForCurrentUser[currentQuestionId] || '';
            setInputName(storedInput);
        }
    }, [userId, currentQuestionId]);
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
                                    <InputText value={inputName} onChange={handleInputChange}/>
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
    const [currentQuestionId, setCurrentQuestionId] = useState(3);
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState(null);
    const [userInputs, setUserInputs] = useState({});

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
            case "Notepad":
                return <ModalNotepad closeModal={closeModal}/>;
            default:
                return null;
        }
    };

    useEffect(() => {
        const getUser = async () => {
            const storedUserId = localStorage.getItem('userId');
            if (!storedUserId) {
                console.error('No user ID found in local storage');
                return;
            }
            setUserId(storedUserId);
            try {
                const response = await axios.get(`http://localhost:5058/users/${storedUserId}`);
                setUserName(response.data.name);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur', error);
            }
        };
        getUser();
    }, []);

    const handleSaveAndNext = async () => {
        if (!userId) {
            console.error('No user ID found in local storage');
            return;
        }
        try {
            await axios.post('http://localhost:5058/createInput', {
                input: inputName,
                userId: parseInt(userId),
                questionId: currentQuestionId,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Input saved successfully');

            // Enregistrer l'entrée dans le stockage local
            const storedUserInputs = JSON.parse(localStorage.getItem('userInputs') || '{}');
            const userInputsForCurrentUser = storedUserInputs[userId] || {};
            userInputsForCurrentUser[currentQuestionId] = inputName;
            storedUserInputs[userId] = userInputsForCurrentUser;
            localStorage.setItem('userInputs', JSON.stringify(storedUserInputs));

            onNext();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'input', error);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputName(value);
        localStorage.setItem(`inputText-${currentQuestionId}`, value);
    };

    useEffect(() => {
        if (userId) {
            // Charger les entrées pour le userId actuel
            const storedUserInputs = JSON.parse(localStorage.getItem('userInputs') || '{}');
            const userInputsForCurrentUser = storedUserInputs[userId] || {};
            const storedInput = userInputsForCurrentUser[currentQuestionId] || '';
            setInputName(storedInput);
        }
    }, [userId, currentQuestionId]);
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
                                    <InputText value={inputName} onChange={handleInputChange}/>
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
    const [currentQuestionId, setCurrentQuestionId] = useState(4);
    const [userId, setUserId] = useState(null);
    const [userInputs, setUserInputs] = useState({});

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
            case "Notepad":
                return <ModalNotepad closeModal={closeModal}/>;
            default:
                return null;
        }
    };

    useEffect(() => {
        const getUser = async () => {
            const storedUserId = localStorage.getItem('userId');
            if (!storedUserId) {
                console.error('No user ID found in local storage');
                return;
            }
            setUserId(storedUserId);
            try {
                const response = await axios.get(`http://localhost:5058/users/${storedUserId}`);
                setUserName(response.data.name);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur', error);
            }
        };
        getUser();
    }, []);

    const handleSaveAndNext = async () => {
        if (!userId) {
            console.error('No user ID found in local storage');
            return;
        }
        try {
            await axios.post('http://localhost:5058/createInput', {
                input: inputName,
                userId: parseInt(userId),
                questionId: currentQuestionId,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Input saved successfully');

            // Enregistrer l'entrée dans le stockage local
            const storedUserInputs = JSON.parse(localStorage.getItem('userInputs') || '{}');
            const userInputsForCurrentUser = storedUserInputs[userId] || {};
            userInputsForCurrentUser[currentQuestionId] = inputName;
            storedUserInputs[userId] = userInputsForCurrentUser;
            localStorage.setItem('userInputs', JSON.stringify(storedUserInputs));

            onNext();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'input', error);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputName(value);
        localStorage.setItem(`inputText-${currentQuestionId}`, value);
    };

    useEffect(() => {
        if (userId) {
            // Charger les entrées pour le userId actuel
            const storedUserInputs = JSON.parse(localStorage.getItem('userInputs') || '{}');
            const userInputsForCurrentUser = storedUserInputs[userId] || {};
            const storedInput = userInputsForCurrentUser[currentQuestionId] || '';
            setInputName(storedInput);
        }
    }, [userId, currentQuestionId]);
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
                                <InputText value={inputName} onChange={handleInputChange}/>
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
    const [currentQuestionId, setCurrentQuestionId] = useState(5);
    const [userId, setUserId] = useState(null);
    const [userInputs, setUserInputs] = useState({});

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
            case "Notepad":
                return <ModalNotepad closeModal={closeModal}/>;
            default:
                return null;
        }
    };


    useEffect(() => {
        const getUser = async () => {
            const storedUserId = localStorage.getItem('userId');
            if (!storedUserId) {
                console.error('No user ID found in local storage');
                return;
            }
            setUserId(storedUserId);
            try {
                const response = await axios.get(`http://localhost:5058/users/${storedUserId}`);
                setUserName(response.data.name);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur', error);
            }
        };
        getUser();
    }, []);

    const handleSaveAndNext = async () => {
        if (!userId) {
            console.error('No user ID found in local storage');
            return;
        }
        try {
            await axios.post('http://localhost:5058/createInput', {
                input: inputName,
                userId: parseInt(userId),
                questionId: currentQuestionId,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Input saved successfully');

            // Enregistrer l'entrée dans le stockage local
            const storedUserInputs = JSON.parse(localStorage.getItem('userInputs') || '{}');
            const userInputsForCurrentUser = storedUserInputs[userId] || {};
            userInputsForCurrentUser[currentQuestionId] = inputName;
            storedUserInputs[userId] = userInputsForCurrentUser;
            localStorage.setItem('userInputs', JSON.stringify(storedUserInputs));

            onNext();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'input', error);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputName(value);
        localStorage.setItem(`inputText-${currentQuestionId}`, value);
    };

    useEffect(() => {
        if (userId) {
            // Charger les entrées pour le userId actuel
            const storedUserInputs = JSON.parse(localStorage.getItem('userInputs') || '{}');
            const userInputsForCurrentUser = storedUserInputs[userId] || {};
            const storedInput = userInputsForCurrentUser[currentQuestionId] || '';
            setInputName(storedInput);
        }
    }, [userId, currentQuestionId]);
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
                                    <InputText value={inputName} onChange={handleInputChange}/>
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
    const [currentQuestionId, setCurrentQuestionId] = useState(6);
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState(null);
    const [userInputs, setUserInputs] = useState({});

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
            case "Notepad":
                return <ModalNotepad closeModal={closeModal}/>;
            default:
                return null;
        }
    };

    useEffect(() => {
        const getUser = async () => {
            const storedUserId = localStorage.getItem('userId');
            if (!storedUserId) {
                console.error('No user ID found in local storage');
                return;
            }
            setUserId(storedUserId);
            try {
                const response = await axios.get(`http://localhost:5058/users/${storedUserId}`);
                setUserName(response.data.name);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur', error);
            }
        };
        getUser();
    }, []);

    const handleSaveAndNext = async () => {
        if (!userId) {
            console.error('No user ID found in local storage');
            return;
        }
        try {
            await axios.post('http://localhost:5058/createInput', {
                input: inputName,
                userId: parseInt(userId),
                questionId: currentQuestionId,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Input saved successfully');

            // Enregistrer l'entrée dans le stockage local
            const storedUserInputs = JSON.parse(localStorage.getItem('userInputs') || '{}');
            const userInputsForCurrentUser = storedUserInputs[userId] || {};
            userInputsForCurrentUser[currentQuestionId] = inputName;
            storedUserInputs[userId] = userInputsForCurrentUser;
            localStorage.setItem('userInputs', JSON.stringify(storedUserInputs));

            onNext();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'input', error);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputName(value);
        localStorage.setItem(`inputText-${currentQuestionId}`, value);
    };

    useEffect(() => {
        if (userId) {
            // Charger les entrées pour le userId actuel
            const storedUserInputs = JSON.parse(localStorage.getItem('userInputs') || '{}');
            const userInputsForCurrentUser = storedUserInputs[userId] || {};
            const storedInput = userInputsForCurrentUser[currentQuestionId] || '';
            setInputName(storedInput);
        }
    }, [userId, currentQuestionId]);
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
                                    <InputText value={inputName} onChange={handleInputChange}/>
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
    const [currentQuestionId, setCurrentQuestionId] = useState(7);
    const [userId, setUserId] = useState(null);
    const [userInputs, setUserInputs] = useState({});

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
            case "Notepad":
                return <ModalNotepad closeModal={closeModal}/>;
            default:
                return null;
        }
    };

    useEffect(() => {
        const getUser = async () => {
            const storedUserId = localStorage.getItem('userId');
            if (!storedUserId) {
                console.error('No user ID found in local storage');
                return;
            }
            setUserId(storedUserId);
            try {
                const response = await axios.get(`http://localhost:5058/users/${storedUserId}`);
                setUserName(response.data.name);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur', error);
            }
        };
        getUser();
    }, []);

    const handleSaveAndNext = async () => {
        if (!userId) {
            console.error('No user ID found in local storage');
            return;
        }
        try {
            await axios.post('http://localhost:5058/createInput', {
                input: inputName,
                userId: parseInt(userId),
                questionId: currentQuestionId,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Input saved successfully');

            // Enregistrer l'entrée dans le stockage local
            const storedUserInputs = JSON.parse(localStorage.getItem('userInputs') || '{}');
            const userInputsForCurrentUser = storedUserInputs[userId] || {};
            userInputsForCurrentUser[currentQuestionId] = inputName;
            storedUserInputs[userId] = userInputsForCurrentUser;
            localStorage.setItem('userInputs', JSON.stringify(storedUserInputs));

            onNext();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'input', error);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputName(value);
        localStorage.setItem(`inputText-${currentQuestionId}`, value);
    };

    useEffect(() => {
        if (userId) {
            // Charger les entrées pour le userId actuel
            const storedUserInputs = JSON.parse(localStorage.getItem('userInputs') || '{}');
            const userInputsForCurrentUser = storedUserInputs[userId] || {};
            const storedInput = userInputsForCurrentUser[currentQuestionId] || '';
            setInputName(storedInput);
        }
    }, [userId, currentQuestionId]);
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
                                    <InputText value={inputName} onChange={handleInputChange}/>
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
            case "Notepad":
                return <ModalNotepad closeModal={closeModal}/>;
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
    const [currentQuestionId, setCurrentQuestionId] = useState(8);
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState(null);
    const [userInputs, setUserInputs] = useState({});

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
            case "Notepad":
                return <ModalNotepad closeModal={closeModal}/>;
            default:
                return null;
        }
    };

    useEffect(() => {
        const getUser = async () => {
            const storedUserId = localStorage.getItem('userId');
            if (!storedUserId) {
                console.error('No user ID found in local storage');
                return;
            }
            setUserId(storedUserId);
            try {
                const response = await axios.get(`http://localhost:5058/users/${storedUserId}`);
                setUserName(response.data.name);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur', error);
            }
        };
        getUser();
    }, []);

    const handleSaveAndNext = async () => {
        if (!userId) {
            console.error('No user ID found in local storage');
            return;
        }
        try {
            await axios.post('http://localhost:5058/createInput', {
                input: inputName,
                userId: parseInt(userId),
                questionId: currentQuestionId,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Input saved successfully');

            // Enregistrer l'entrée dans le stockage local
            const storedUserInputs = JSON.parse(localStorage.getItem('userInputs') || '{}');
            const userInputsForCurrentUser = storedUserInputs[userId] || {};
            userInputsForCurrentUser[currentQuestionId] = inputName;
            storedUserInputs[userId] = userInputsForCurrentUser;
            localStorage.setItem('userInputs', JSON.stringify(storedUserInputs));

            onNext();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'input', error);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputName(value);
        localStorage.setItem(`inputText-${currentQuestionId}`, value);
    };

    useEffect(() => {
        if (userId) {
            // Charger les entrées pour le userId actuel
            const storedUserInputs = JSON.parse(localStorage.getItem('userInputs') || '{}');
            const userInputsForCurrentUser = storedUserInputs[userId] || {};
            const storedInput = userInputsForCurrentUser[currentQuestionId] || '';
            setInputName(storedInput);
        }
    }, [userId, currentQuestionId]);
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
                            <h1 className='text-4xl ml-2 text-white font-bold'>PARTIE 10 : PRÉSENTATION DE VOTRE OFFRE :
                                (2 / 2)</h1>
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
                                    <InputText value={inputName} onChange={handleInputChange}/>
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

function QuizOnboardingStep16({handleHabitualClick, time, formatTime, onNext, onPrev}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");
    const [chronoBackground, setChronoBackground] = useState("");
    const [chronoTextColor, setChronoTextColor] = useState("");
    const [currentQuestionId, setCurrentQuestionId] = useState(9);

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
            case "Notepad":
                return <ModalNotepad closeModal={closeModal}/>;
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
                    questionId: currentQuestionId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to save choice');
            }
            const data = await response.json();
            console.log('Success:', data);
            if (choice === 'Le client a demandé le prix') {
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
                            <h1 className='text-4xl ml-2 text-white font-bold'>PARTIE 10 : PRÉSENTATION DE VOTRE OFFRE :</h1>
                            <Chronometre chronoBackground={chronoBackground} chronoTextColor={chronoTextColor} formatTime={formatTime} time={time}/>
                        </div>
                        <div className='flex flex-col bg-gray-800/50 py-24 px-36 mt-16 rounded-2xl items-center'>
                            <div className='text-white pr-1.5 pl-2'>
                                <div className='mx-4'>
                                    <div className='flex flex-grow justify-center items-center space-x-28'>
                                        <button onClick={() => choiceButtonClick('Le client n\'a pas demander le prix')}
                                                className='flex bg-gray-400/80 hover:bg-gray-500 text-white pl-20 py-4 rounded-3xl font-bold text-lg'>
                                            <div className='flex flex-col'>
                                                <div className='flex justify-center items-center max-w-64'>
                                                    <div className='text-xl uppercase'>le client de vous demande <strong>pas</strong> le <strong>prix</strong></div>
                                                </div>
                                                <div className='flex justify-end flex-grow my-0.5'>
                                                    <div className='flex justify-center items-center ml-12 mr-12 my-8'>
                                                        <img className='h-36 w-28 my-5 mr-3 ml-4'
                                                             src={require('../img/BagMoneyRemove.png')}/>
                                                    </div>
                                                    <div className='flex items-end mb-8 mr-4'>
                                                        <img className='h-20 w-24 py-1'
                                                             src={require('../img/fleche.png')}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                        <button onClick={() => choiceButtonClick('Le client a demandé le prix')}
                                                className='flex bg-gray-400/80 hover:bg-gray-500 text-white pl-20 py-4 rounded-3xl font-bold text-lg'>
                                            <div className='flex flex-col'>
                                                <div className='flex justify-center items-center max-w-64'>
                                                    <div className='text-xl uppercase'>le client de vous <strong>demande</strong> le <strong>prix</strong></div>
                                                </div>
                                                <div className='flex justify-end flex-grow my-0.5'>
                                                    <div className='flex justify-center items-center pl-12 mr-12 my-8'>
                                                        <img className='h-36 w-28 my-5 mr-3 ml-4'
                                                             src={require('../img/BagMoney.png')}/>
                                                    </div>
                                                    <div className='flex items-end mb-8 mr-4'>
                                                        <img className='h-20 w-24 py-1'
                                                             src={require('../img/fleche.png')}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                    {modalVisible && renderModal()}
                                </div>
                            </div>
                        </div>
                        <div className='mt-10 mb-8 grid grid-cols-6 gap-2'>
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

function QuizOnboardingStep17({onNext, onPrev, time, formatTime}) {
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
            case "Notepad":
                return <ModalNotepad closeModal={closeModal}/>;
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
                    <div className='mx-10'>
                        <div className='flex flex-grow'>
                            <h1 className='text-4xl ml-2 text-white font-bold'>PRÉSENTATION DE VOTRE OFFRE (2 / 2)</h1>
                            <Chronometre chronoBackground={chronoBackground} chronoTextColor={chronoTextColor} formatTime={formatTime} time={time}/>
                        </div>
                        <div className='flex flex-col bg-gray-800/50 mt-16 rounded-2xl items-center'>
                            <div className='text-white ml-1.5'>
                                <div className='ml-12 mr-24 max-w-6xl my-10'>
                                    {modalVisible && renderModal()}
                                    <h1 className='text-xl font-bold'>Parfait ! Est-ce que vous souhaitez que je
                                        donne l’investissement pour rejoindre l’aventure ?</h1>
                                    <div className='flex flex-col my-5'>
                                        <div className='flex items-center bg-blue-950/20 text-white rounded-full w-72'>
                                            <img className='h-11 w-20 my-3 ml-1'
                                                 src={require('../img/intonation-emoji/secret.png')}
                                                 alt="logo"/>Prenez une intonation : <br/>"secret"
                                        </div>
                                    </div>
                                    <h1 className='text-xl font-bold '>Alors pour rejoindre nos clients nous avons 2
                                        accompagnement, premier qui est un accompagnement
                                        de 3 mois via Zoom ou l’on se fixe connecte , que nous proposons à 5000€</h1>
                                    <h1 className='text-xl italic my-4'>(pause)</h1>
                                    <h1 className='text-xl font-bold '>Mais au vu de ce que vous venez de me dire, je
                                        pense que ce qui vous correspondrez mieux, c’est
                                        plûtot notre 2ème type d’accompagnement, qui est notre programme de formation en
                                        ligne, qui
                                        délivre la même promesse que le coaching, sauf qu’au lieu d’échanger ensemble
                                        vous avez tous les
                                        éléments enregistré sur une plateforme, avec des vidéos que vous pouvez suivre à
                                        votre rythme, et
                                        revoir autant de fois que vous voulez, et pour rejoindre le programme
                                        l’investissement est de 1000€.</h1>
                                    <div className='flex flex-col my-5'>
                                        <div className='flex items-center bg-blue-950/20 text-white rounded-full w-72'>
                                            <img className='h-11 w-20 my-3 ml-1'
                                                 src={require('../img/intonation-emoji/obvious.png')}
                                                 alt="logo"/>Prenez une intonation : <br/>"c'est une évidence"
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-5 mb-4 grid grid-cols-6 gap-2'>
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

function QuizOnboardingStep18({onNext, onPrev, handleHabitualClickReturn, time, formatTime}) {
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
            case "Notepad":
                return <ModalNotepad closeModal={closeModal}/>;
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
                            <h1 className='text-4xl ml-2 text-white font-bold'>PRÉSENTATION DE VOTRE OFFRE (2 / 2)</h1>
                            <Chronometre chronoBackground={chronoBackground} chronoTextColor={chronoTextColor} formatTime={formatTime} time={time}/>
                        </div>
                        <div className='flex flex-col bg-gray-800/50 mt-16 rounded-2xl items-center'>
                            <div className='text-white ml-1.5'>
                                <div className='ml-12 mr-24 max-w-6xl my-10'>
                                    {modalVisible && renderModal()}
                                    <h1 className='text-2xl font-bold'>Alors pour rejoindre nos clients nous avons 2
                                        accompagnement, premier qui est un
                                        accompagnement de 3 mois via Zoom ou l’on se fixe connecte , que nous proposons
                                        à
                                        5000€</h1>
                                    <h1 className='text-xl italic my-5'>(pause)</h1>
                                    <div className='flex flex-col my-5'>
                                        <div className='flex items-center bg-blue-950/20 text-white rounded-full w-72'>
                                            <img className='h-11 w-20 my-3 ml-1'
                                                 src={require('../img/intonation-emoji/secret.png')}
                                                 alt="logo"/>Prenez une intonation : <br/>"secret"
                                        </div>
                                    </div>
                                    <h1 className='text-2xl font-bold'>Mais au vu de ce que vous venez de me dire, je
                                        pense que ce qui vous correspondrez mieux,
                                        c’est plûtot notre 2ème type d’accompagnement, qui est notre programme de
                                        formation en
                                        ligne, qui délivre la même promesse que le coaching, sauf qu’au lieu d’échanger
                                        ensemble
                                        vous avez tous les éléments enregistré sur une plateforme, avec des vidéos que
                                        vous
                                        pouvez suivre à votre rythme, et revoir autant de fois que vous voulez, et pour
                                        rejoindre le
                                        programme l’investissement est de 1000€.</h1>
                                    <div className='flex flex-col my-5'>
                                        <div className='flex items-center bg-blue-950/20 text-white rounded-full w-72'>
                                            <img className='h-11 w-20 my-3 ml-1'
                                                 src={require('../img/intonation-emoji/obvious.png')}
                                                 alt="logo"/>Prenez une intonation : <br/>"c'est une évidence"
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-5 mb-4 grid grid-cols-6 gap-2'>
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

function QuizOnboardingStep19({handleHabitualClick, handleClickReturn, time, formatTime, onNext, onPrev}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");
    const [chronoBackground, setChronoBackground] = useState("");
    const [chronoTextColor, setChronoTextColor] = useState("");
    const [currentQuestionId, setCurrentQuestionId] = useState(10);

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
            case "Notepad":
                return <ModalNotepad closeModal={closeModal}/>;
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
                    questionId: currentQuestionId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to save choice');
            }
            const data = await response.json();
            console.log('Success:', data);
            if (choice === 'Le client s\'échappe de l\'appel avec\n + une objection ?') {
                onNext();
            } else {
                handleHabitualClick();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <div
            className={`flex justify-items-center mr-24 z-10 ${modalVisible ? 'fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center pr-24' : ''}`}>
            <div className='flex justify-center mx-16 z-50 my-80'>
                <div
                    className='flex items-center justify-center bg-gray-400/30 rounded-full border-4 border-gray-500/25 backdrop-blur-sm p-6 my-10'>
                    <div
                        className={`flex h-24 w-24 items-center justify-center rounded-full border-2 border-white ${buttonActive === "Notepad" ? "bg-gray-500" : 'bg-gray-900/25 hover:border-4 hover:bg-gray-500'}`}>
                        <button className='h-16 w-16' title="Click Here" onClick={() => openModal("Notepad")}>
                            <img className='w-16 h-16' src={require('../img/block-note.png')} alt="logo"/>
                        </button>
                    </div>
                </div>
            </div>
            <div className='flex justify-center items-center'>
                <div className='bg-gray-400/30 rounded-3xl border-4 border-gray-500/25 backdrop-blur-sm pt-14'>
                    <div className='mb-2.5 mx-10'>
                        <div className='flex flex-grow'>
                            <h1 className='text-4xl text-white font-bold'></h1>
                            <Chronometre chronoBackground={chronoBackground} chronoTextColor={chronoTextColor}
                                         formatTime={formatTime} time={time}/>
                        </div>
                        <div className='flex flex-col bg-gray-800/50 mt-16 rounded-2xl items-center'>
                            <div className='text-white my-0.5 mx-36'>
                                <div className='max-w-6xl my-14 ml-0.5'>
                                    {modalVisible && renderModal()}
                                    <div className='flex flex-col items-center'>
                                        <div className='flex space-x-7'>
                                            <button
                                                className='group flex bg-black/30 hover:bg-black/40 text-white py-8 px-8 rounded-3xl font-bold text-lg'>
                                                <div className='flex flex-grow'>
                                                    <div className='flex flex-col'>
                                                        <div className='flex flex-grow px-12'>
                                                            <div>
                                                                <h1 className='text-2xl'>Le client à un doute ?</h1>
                                                            </div>
                                                            <div>
                                                                <img className='h-10 w-10 ml-4'
                                                                     src={require('../img/Thinking.png')} alt="logo"/>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className='flex items-center justify-center bg-gray-400/60 group-hover:bg-gray-500/60 rounded-2xl py-2 ml-11 mr-6 mt-3'>
                                                            <h1 className='text-2xl uppercase group-hover:text-gray-200'>rassurer-le
                                                                !</h1>
                                                            <div className='flex items-end'>
                                                                <img className='h-16 w-20 ml-5 py-0.5'
                                                                     src={require('../img/fleche.png')}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                            <button
                                                className='group flex bg-violet-300/30 hover:bg-violet-400/30 text-white py-8 px-8 rounded-3xl font-bold text-lg'>
                                                <div className='flex flex-grow'>
                                                    <div className='flex flex-col'>
                                                        <div className='flex flex-grow px-12'>
                                                            <div>
                                                                <h1 className='text-2xl'>Le client est partant ?</h1>
                                                            </div>
                                                            <div>
                                                                <img className='h-10 w-14 ml-4'
                                                                     src={require('../img/good.png')}
                                                                     alt="logo"/>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className='flex items-center justify-center bg-gray-400/60 group-hover:bg-gray-500/60 rounded-2xl py-2 ml-6 mr-12 mt-3'>
                                                            <h1 className='text-2xl uppercase'>closer le deal !</h1>
                                                            <div className='flex items-end'>
                                                                <img className='h-16 w-20 ml-5 py-0.5'
                                                                     src={require('../img/fleche.png')}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                        <div className='flex mt-7'>
                                            <button
                                                onClick={() => choiceButtonClick('Le client s\'échappe de l\'appel avec\n + une objection ?')}
                                                className='group flex bg-black/30 hover:bg-black/40 text-white py-4 px-12 rounded-3xl font-bold text-lg'>
                                                <div className='flex flex-grow'>
                                                    <div className='flex flex-col pb-7 pt-3 px-8'>
                                                        <div
                                                            className='flex flex-grow justify-center items-center ml-14'>
                                                            <div className='flex mt-6'>
                                                                <h1 className='text-2xl'>Le client s'échappe de l'appel
                                                                    avec
                                                                    une objection ?</h1>
                                                            </div>
                                                            <div>
                                                                <img className='h-24 w-24'
                                                                     src={require('../img/man.png')}
                                                                     alt="logo"/>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className='flex items-center justify-center bg-gray-400/60 group-hover:bg-gray-500/60 rounded-2xl px-14 py-3 mt-6'>
                                                            <h1 className='text-2xl uppercase'>réfuter & garder le
                                                                prospect dans la vente !</h1>
                                                            <div className='flex items-end ml-10'>
                                                                <img className='h-16 w-20 py-0.5'
                                                                     src={require('../img/fleche.png')}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-5 mb-4 grid grid-cols-6 gap-2'>
                            <div className='flex col-end-11 space-x-3 col-span-3'>
                                <div className='flex mt-6 justify-end'>
                                    <button onClick={handleClickReturn}
                                            className='flex bg-gray-400/80 hover:bg-gray-500 text-white font-bold py-2.5 px-3 rounded-full'>
                                        <img className='h-5 w-5 my-4 mr-4 ml-3 rotate-180'
                                             src={require('../img/play.png')}
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

function QuizOnboardingStep20({handleHabitualClick, time, formatTime, onNext, onPrev}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");
    const [chronoBackground, setChronoBackground] = useState("");
    const [chronoTextColor, setChronoTextColor] = useState("");
    const [currentQuestionId, setCurrentQuestionId] = useState(11);

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
            case "Notepad":
                return <ModalNotepad closeModal={closeModal}/>;
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
                    questionId: currentQuestionId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to save choice');
            }
            const data = await response.json();
            console.log('Success:', data);
            if (choice === 'Pas confiance en vous !') {
                onNext();
            } else {
                handleHabitualClick();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <div className={`flex justify-items-center mr-24 z-10 ${modalVisible ? 'fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center pr-24' : ''}`}>
            <div className='flex justify-center mx-16 z-50 my-80'>
                <div className='flex items-center justify-center bg-gray-400/30 rounded-full border-4 border-gray-500/25 backdrop-blur-sm p-6 my-10'>
                    <div className={`flex h-24 w-24 items-center justify-center rounded-full border-2 border-white ${buttonActive === "Notepad" ? "bg-gray-500" : 'bg-gray-900/25 hover:border-4 hover:bg-gray-500'}`}>
                        <button className='h-16 w-16' title="Click Here" onClick={() => openModal("Notepad")}>
                            <img className='w-16 h-16' src={require('../img/block-note.png')} alt="logo"/>
                        </button>
                    </div>
                </div>
            </div>
            <div className='flex justify-items-center'>
                <div
                    className={`bg-gray-400/30 rounded-3xl ${modalVisible ? '' : 'border-4'} border-gray-500/25 backdrop-blur-sm pt-14`}>
                    <div className='mb-2.5 mx-10'>
                        <div className='flex flex-grow mr-96'>
                            <h1 className='text-4xl ml-2 text-white font-bold uppercase'>étape 1 : <span className='text-violet-400'>c</span>larifier la crainte
                                du prospect</h1>
                            <Chronometre chronoBackground={chronoBackground} chronoTextColor={chronoTextColor}
                                         formatTime={formatTime} time={time}/>
                        </div>
                        <div className='flex flex-col bg-gray-800/50 pb-24 pt-16 px-36 mt-16 rounded-2xl items-center'>
                            <div className='flex flex-col text-white pb-16 pt-2'>
                                <h1 className='text-3xl font-bold'>"Ok John, mais concrètement ? Que pensez-vous de
                                    l'offre ?"</h1>
                            </div>
                            <div className='text-white pr-2 pl-2'>
                                <div className='mx-4'>
                                    <div className='flex flex-grow justify-center items-center space-x-28'>
                                        <button onClick={() => choiceButtonClick('Pas confiance en vous !')}
                                            className='flex bg-gray-400/80 hover:bg-gray-500 text-white py-4 rounded-3xl font-bold text-lg'>
                                            <div className='flex flex-col'>
                                                <div className='flex justify-center items-center'>
                                                    <div className='text-xl uppercase'>pas confiance en vous ?</div>
                                                </div>
                                                <div className='flex justify-end flex-grow my-0.5'>
                                                    <div className='flex justify-center items-center ml-24 mr-10 my-8'>
                                                        <img className='h-36 w-36 my-5'
                                                             src={require('../img/pointing.png')}/>
                                                    </div>
                                                    <div className='flex items-end mb-8 mx-4'>
                                                        <img className='h-20 w-24 py-1'
                                                             src={require('../img/fleche.png')}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                        <button onClick={() => choiceButtonClick('Pas confiance en votre offre !')}
                                            className='flex bg-gray-400/80 hover:bg-gray-500 text-white py-4 rounded-3xl font-bold text-lg'>
                                            <div className='flex flex-col'>
                                                <div className='flex justify-center items-center'>
                                                    <div className='text-xl uppercase'>pas confiance en votre offre ?
                                                    </div>
                                                </div>
                                                <div className='flex justify-end flex-grow my-0.5'>
                                                    <div className='flex justify-center items-center ml-24 mr-10 my-8'>
                                                        <img className='h-36 w-36 my-5 ml-4'
                                                             src={require('../img/ampoule.png')}/>
                                                    </div>
                                                    <div className='flex items-end mb-8 mx-4'>
                                                        <img className='h-20 w-24 py-1'
                                                             src={require('../img/fleche.png')}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                    {modalVisible && renderModal()}
                                </div>
                            </div>
                        </div>
                        <div className='mt-5 mb-4 grid grid-cols-6 gap-2'>
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

function QuizOnboardingStep21({handleHabitualClick, time, formatTime, onNext, onPrev}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");
    const [chronoBackground, setChronoBackground] = useState("");
    const [chronoTextColor, setChronoTextColor] = useState("");
    const [currentQuestionId, setCurrentQuestionId] = useState(11);

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
            case "Notepad":
                return <ModalNotepad closeModal={closeModal}/>;
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
                    questionId: currentQuestionId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to save choice');
            }
            const data = await response.json();
            console.log('Success:', data);
            if (choice === 'Pas confiance en vous !') {
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
            <div className='flex justify-center mx-16 z-50 my-80'>
                <div className='flex items-center justify-center bg-gray-400/30 rounded-full border-4 border-gray-500/25 backdrop-blur-sm p-6 my-10'>
                    <div className={`flex h-24 w-24 items-center justify-center rounded-full border-2 border-white ${buttonActive === "Notepad" ? "bg-gray-500" : 'bg-gray-900/25 hover:border-4 hover:bg-gray-500'}`}>
                        <button className='h-16 w-16' title="Click Here" onClick={() => openModal("Notepad")}>
                            <img className='w-16 h-16' src={require('../img/block-note.png')} alt="logo"/>
                        </button>
                    </div>
                </div>
            </div>
            <div className='flex justify-items-center'>
                <div
                    className={`bg-gray-400/30 rounded-3xl ${modalVisible ? '' : 'border-4'} border-gray-500/25 backdrop-blur-sm pt-14`}>
                    <div className='mb-2.5 mx-10'>
                        <div className='flex flex-grow mr-96'>
                            <h1 className='text-4xl ml-2 text-white font-bold uppercase'>étape 2 : <span
                                className='text-violet-400'>d</span>iscuter
                                avec le prospect</h1>
                            <Chronometre chronoBackground={chronoBackground} chronoTextColor={chronoTextColor}
                                         formatTime={formatTime} time={time}/>
                        </div>
                        <div className='flex flex-col bg-gray-800/50 pb-24 pt-16 px-36 mt-16 rounded-2xl items-center'>
                            <div className='flex flex-col text-white pb-16 pt-2'>
                                <h1 className='text-3xl font-bold'>"D'accord ! Et d'ou vous viens [ <span className='text-violet-400 italic'>cette crainte sur vous ?</span> ]"</h1>
                            </div>
                            <div className='text-white pr-2 pl-2'>
                                <div className='mx-8'>
                                    <div className='flex flex-grow justify-center items-center space-x-28'>
                                        <div
                                                className='flex bg-gray-400/80 text-white py-4 rounded-3xl font-bold text-lg'>
                                            <div className='flex flex-col'>
                                                <div className='flex justify-center items-center'>
                                                    <div className='text-xl uppercase'>pas confiance en vous ?</div>
                                                </div>
                                                <div className='flex justify-end flex-grow my-0.5 mx-4'>
                                                    <div className='flex justify-center items-center mx-28 my-8'>
                                                        <img className='h-36 w-36 my-5'
                                                             src={require('../img/pointing.png')}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => choiceButtonClick('Pas confiance en votre offre !')}
                                                className='flex bg-gray-700/80 hover:bg-gray-700 text-gray-500 py-4 rounded-3xl font-bold text-lg'>
                                            <div className='flex flex-col'>
                                                <div className='flex justify-center items-center'>
                                                    <div className='text-lg uppercase'>pas confiance en votre offre ?
                                                    </div>
                                                </div>
                                                <div className='flex justify-end flex-grow my-0.5 mx-4'>
                                                    <div className='flex justify-center items-center mx-28 my-8'>
                                                        <img className='h-32 w-32 my-5 ml-4'
                                                             src={require('../img/ampoule.png')}
                                                             style={{ filter: 'brightness(0.5)' }}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                    {modalVisible && renderModal()}
                                </div>
                            </div>
                        </div>
                        <div className='mt-5 mb-4 grid grid-cols-6 gap-2'>
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
                                    <button onClick={() => choiceButtonClick('Pas confiance en vous !')}
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

function QuizOnboardingStep22({handleHabitualClick, handleHabitualClickReturn, time, formatTime, onNext, onPrev}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");
    const [chronoBackground, setChronoBackground] = useState("");
    const [chronoTextColor, setChronoTextColor] = useState("");
    const [currentQuestionId, setCurrentQuestionId] = useState(11);

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
            case "Notepad":
                return <ModalNotepad closeModal={closeModal}/>;
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
                    questionId: currentQuestionId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to save choice');
            }
            const data = await response.json();
            console.log('Success:', data);
            if (choice === 'Pas confiance en votre offre !') {
                handleHabitualClick();
            } else {
                onPrev();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <div
            className={`flex justify-items-center mr-24 z-10 ${modalVisible ? 'fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center pr-24' : ''}`}>
            <div className='flex justify-center mx-16 z-50 my-80'>
                <div
                    className='flex items-center justify-center bg-gray-400/30 rounded-full border-4 border-gray-500/25 backdrop-blur-sm p-6 my-10'>
                    <div
                        className={`flex h-24 w-24 items-center justify-center rounded-full border-2 border-white ${buttonActive === "Notepad" ? "bg-gray-500" : 'bg-gray-900/25 hover:border-4 hover:bg-gray-500'}`}>
                        <button className='h-16 w-16' title="Click Here" onClick={() => openModal("Notepad")}>
                            <img className='w-16 h-16' src={require('../img/block-note.png')} alt="logo"/>
                        </button>
                    </div>
                </div>
            </div>
            <div className='flex justify-items-center'>
                <div
                    className={`bg-gray-400/30 rounded-3xl ${modalVisible ? '' : 'border-4'} border-gray-500/25 backdrop-blur-sm pt-14`}>
                    <div className='mb-2.5 mx-10'>
                        <div className='flex flex-grow mr-96'>
                            <h1 className='text-4xl ml-2 text-white font-bold uppercase'>étape 2 : <span className='text-violet-400'>d</span>iscuter
                                avec le prospect</h1>
                            <Chronometre chronoBackground={chronoBackground} chronoTextColor={chronoTextColor}
                                         formatTime={formatTime} time={time}/>
                        </div>
                        <div className='flex flex-col bg-gray-800/50 pb-24 pt-16 px-36 mt-16 rounded-2xl items-center'>
                            <div className='flex flex-col text-white pb-16 pt-2'>
                                <h1 className='text-3xl font-bold'>"D'accord ! Et d'ou vous viens [ <span className='text-violet-400 italic'>cette crainte sur votre offre ?</span> ]"</h1>
                            </div>
                            <div className='text-white pr-2 pl-2'>
                                <div className='mx-8'>
                                    <div className='flex flex-grow justify-center items-center space-x-28'>
                                        <button onClick={() => choiceButtonClick('Pas confiance en vous !')}
                                                className='flex bg-gray-700/80 hover:bg-gray-700 text-gray-500 py-4 rounded-3xl font-bold text-lg'>
                                            <div className='flex flex-col'>
                                                <div className='flex justify-center items-center'>
                                                    <div className='text-lg uppercase'>pas confiance en vous ?</div>
                                                </div>
                                                <div className='flex justify-end flex-grow my-0.5 mx-4'>
                                                    <div className='flex justify-center items-center mx-28 my-8'>
                                                        <img className='h-32 w-32 my-5'
                                                             src={require('../img/pointing.png')}
                                                             style={{ filter: 'brightness(0.5)' }}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                        <div
                                                className='flex bg-gray-400/80 text-white py-4 rounded-3xl font-bold text-lg'>
                                            <div className='flex flex-col'>
                                                <div className='flex justify-center items-center'>
                                                    <div className='text-xl uppercase'>pas confiance en votre offre ?</div>
                                                </div>
                                                <div className='flex justify-end flex-grow my-0.5 mx-4'>
                                                    <div className='flex justify-center items-center mx-28 my-8'>
                                                        <img className='h-36 w-36 my-5 ml-4'
                                                             src={require('../img/ampoule.png')}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {modalVisible && renderModal()}
                                </div>
                            </div>
                        </div>
                        <div className='mt-5 mb-4 grid grid-cols-6 gap-2'>
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
                                    <button onClick={() => choiceButtonClick('Pas confiance en votre offre !')}
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

function QuizOnboardingStep23({handleHabitualClick, time, formatTime, onNext, onPrev}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");
    const [chronoBackground, setChronoBackground] = useState("");
    const [chronoTextColor, setChronoTextColor] = useState("");
    const [currentQuestionId, setCurrentQuestionId] = useState(11);

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
            case "History1":
                return <ModalHistory number={"1"} text={"Vous n'avez pas d'histoire renseignée sur cette aiguille"} closeModal={closeModal}/>;
            case "History2":
                return <ModalHistory number={"2"} text={"Vous n'avez pas d'histoire renseignée sur cette aiguille"} closeModal={closeModal}/>;
            case "History3":
                return <ModalHistory number={"3"} text={"Vous n'avez pas d'histoire renseignée sur cette aiguille"} closeModal={closeModal}/>;
            case "History4":
                return <ModalHistory number={"4"} text={"Vous n'avez pas d'histoire renseignée sur cette aiguille"} closeModal={closeModal}/>;
            case "Notepad":
                return <ModalNotepad closeModal={closeModal}/>;
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
                    questionId: currentQuestionId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to save choice');
            }
            const data = await response.json();
            console.log('Success:', data);
            if (choice === 'Pas confiance en vous !') {
                onNext();
            } else {
                handleHabitualClick();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <div className={`flex justify-items-center mr-24 z-10 ${modalVisible ? 'fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center pr-24' : ''}`}>
            <div className='flex justify-center mx-16 z-50 my-80'>
                <div className='flex items-center justify-center bg-gray-400/30 rounded-full border-4 border-gray-500/25 backdrop-blur-sm p-6 my-10'>
                    <div className={`flex h-24 w-24 items-center justify-center rounded-full border-2 border-white ${buttonActive === "Notepad" ? "bg-gray-500" : 'bg-gray-900/25 hover:border-4 hover:bg-gray-500'}`}>
                        <button className='h-16 w-16' title="Click Here" onClick={() => openModal("Notepad")}>
                            <img className='w-16 h-16' src={require('../img/block-note.png')} alt="logo"/>
                        </button>
                    </div>
                </div>
            </div>
            <div className='flex justify-items-center'>
                <div
                    className={`bg-gray-400/30 rounded-3xl ${modalVisible ? '' : 'border-4'} border-gray-500/25 backdrop-blur-sm pt-14`}>
                    <div className='mb-2.5 mx-10'>
                        <div className='flex flex-grow mr-64'>
                            <h1 className='text-4xl ml-2 text-white font-bold uppercase'>étape 3 : <span className='text-violet-400'>d</span>émonter
                                l'objection avec une histoire</h1>
                            <Chronometre chronoBackground={chronoBackground} chronoTextColor={chronoTextColor}
                                         formatTime={formatTime} time={time}/>
                        </div>
                        <div className='flex flex-col bg-gray-800/50 mt-16 rounded-2xl items-center'>
                            <div className='text-white pr-2 pl-2 mt-7 mb-8 mx-16'>
                                {modalVisible && renderModal()}
                                <div className='flex flex-col space-y-20 mr-1'>
                                    <div className='flex flex-grow justify-center items-center space-x-9'>
                                        <div
                                            className='flex bg-gray-400/80 text-white rounded-3xl font-bold text-lg px-28 py-7'>
                                            <div className='flex flex-col'>
                                                <div className='flex justify-center items-center'>
                                                    <div className='flex'>
                                                        <h1 className='text-xl uppercase'>Rassurer le <span className='underline'>sur vous</span> !</h1>
                                                    </div>
                                                    <div>
                                                        <img className='h-10 w-10 ml-4'
                                                             src={require('../img/pointing.png')}
                                                             alt="logo"/>
                                                    </div>
                                                </div>
                                                <div className='flex flex-col mt-4 ml-10 space-y-4'>
                                                    <div className='flex flex-grow space-x-10'>
                                                        <div
                                                            className='flex items-center bg-gray-300/50 rounded-full p-2'>
                                                            <img className='h-4 w-4 pl-1'
                                                                 src={require('../img/play.png')}
                                                                 alt="logo"/>
                                                        </div>
                                                        <div
                                                            className={`flex rounded-full justify-center px-5 items-center ${buttonActive === "History1" ? '' : ' hover:bg-gray-500'}`}>
                                                            <button className='text-xl' onClick={() => openModal("History1")}>Histoire 1</button>
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-grow space-x-10'>
                                                        <div
                                                            className='flex items-center bg-gray-300/50 rounded-full p-2'>
                                                            <img className='h-4 w-4 pl-1'
                                                                 src={require('../img/play.png')}
                                                                 alt="logo"/>
                                                        </div>
                                                        <div
                                                            className={`flex rounded-full justify-center px-5 items-center ${buttonActive === "History2" ? '' : ' hover:bg-gray-500'}`}>
                                                            <button className='text-xl' onClick={() => openModal("History2")}>Histoire 2</button>
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-grow space-x-10'>
                                                        <div
                                                            className='flex items-center bg-gray-300/50 rounded-full p-2'>
                                                            <img className='h-4 w-4 pl-1'
                                                                 src={require('../img/play.png')}
                                                                 alt="logo"/>
                                                        </div>
                                                        <div
                                                            className={`flex rounded-full justify-center px-5 items-center ${buttonActive === "History3" ? '' : ' hover:bg-gray-500'}`}>
                                                            <button className='text-xl' onClick={() => openModal("History3")}>Histoire 3</button>
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-grow space-x-10'>
                                                        <div
                                                            className='flex items-center bg-gray-300/50 rounded-full p-2'>
                                                            <img className='h-4 w-4 pl-1'
                                                                 src={require('../img/play.png')}
                                                                 alt="logo"/>
                                                        </div>
                                                        <div
                                                            className={`flex rounded-full justify-center px-5 items-center ${buttonActive === "History4" ? '' : ' hover:bg-gray-500'}`}>
                                                            <button className='text-xl' onClick={() => openModal("History4")}>Histoire 4</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={onNext}
                                            className='flex bg-gray-700/80 hover:bg-gray-700 text-gray-500 rounded-3xl font-bold text-lg px-24 py-5'>
                                            <div className='flex flex-col'>
                                                <div className='flex justify-center items-center'>
                                                <div className='flex'>
                                                        <h1 className='text-xl uppercase'>Rassurer le <span className='underline'>sur votre offre</span> !</h1>
                                                    </div>
                                                    <div>
                                                        <img className='h-10 w-10 ml-4'
                                                             src={require('../img/ampoule.png')}
                                                             style={{ filter: 'brightness(0.5)' }}/>
                                                    </div>
                                                </div>
                                                <div className='flex flex-col mt-4 ml-10 space-y-4'>
                                                    <ButtonHistoryNotClic number={"1"}/>
                                                    <ButtonHistoryNotClic number={"2"}/>
                                                    <ButtonHistoryNotClic number={"3"}/>
                                                    <ButtonHistoryNotClic number={"4"}/>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                    <div className='flex space-x-7'>
                                        <button
                                                className='group flex bg-black/30 hover:bg-black/40 text-white rounded-3xl font-bold text-lg'>
                                            <div className='flex flex-grow mx-16 my-5'>
                                                <div className='flex flex-col'>
                                                    <div className='flex flex-grow'>
                                                        <div className='flex mt-3'>
                                                            <h1 className='text-lg'>Le client veut toujours quitter
                                                                l'appel ?</h1>
                                                        </div>
                                                        <div>
                                                            <img className='h-14 w-14'
                                                                 src={require('../img/man.png')}
                                                                 alt="logo"/>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className='flex items-center justify-center bg-gray-400/60 group-hover:bg-gray-500/60 rounded-full mt-2'>
                                                        <h1 className='text-sm uppercase'>garder le dans la vente !</h1>
                                                        <div className='flex items-end'>
                                                            <img className='h-12 w-16 ml-5 py-0.5'
                                                                 src={require('../img/fleche.png')}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                        <button
                                            className='group flex bg-violet-300/30 hover:bg-violet-400/30 text-white rounded-3xl font-bold text-lg'>
                                            <div className='flex flex-grow mx-24 my-5 mt-7'>
                                                <div className='flex flex-col'>
                                                    <div className='flex flex-grow justify-center'>
                                                        <div>
                                                            <h1 className='text-lg'>le client est partant ?</h1>
                                                        </div>
                                                        <div>
                                                            <img className='h-10 w-14 ml-4'
                                                                 src={require('../img/good.png')}
                                                                 alt="logo"/>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className='flex items-center justify-center bg-gray-400/60 group-hover:bg-gray-500/60 rounded-full px-6 mt-4'>
                                                        <h1 className='text-sm uppercase'>terminez de conclure la vente !</h1>
                                                        <div className='flex items-end'>
                                                            <img className='h-12 w-16 ml-5 py-0.5'
                                                                 src={require('../img/fleche.png')}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-5 mb-4 grid grid-cols-6 gap-2'>
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

function QuizOnboardingStep24({handleHabitualClick, handleClickreturn2, time, formatTime, onNext, onPrev}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonActive, setButtonActive] = useState("");
    const [modalType, setModalType] = useState("");
    const [chronoBackground, setChronoBackground] = useState("");
    const [chronoTextColor, setChronoTextColor] = useState("");
    const [currentQuestionId, setCurrentQuestionId] = useState(11);

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
            case "History1":
                return <ModalHistory number={"1"} text={"Vous n'avez pas d'histoire renseignée sur cette aiguille"} closeModal={closeModal}/>;
            case "History2":
                return <ModalHistory number={"2"} text={"Vous n'avez pas d'histoire renseignée sur cette aiguille"} closeModal={closeModal}/>;
            case "History3":
                return <ModalHistory number={"3"} text={"Vous n'avez pas d'histoire renseignée sur cette aiguille"} closeModal={closeModal}/>;
            case "History4":
                return <ModalHistory number={"4"} text={"Vous n'avez pas d'histoire renseignée sur cette aiguille"} closeModal={closeModal}/>;
            case "Notepad":
                return <ModalNotepad closeModal={closeModal}/>;
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
                    questionId: currentQuestionId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to save choice');
            }
            const data = await response.json();
            console.log('Success:', data);
            if (choice === 'Pas confiance en vous !') {
                onNext();
            } else {
                handleHabitualClick();
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <div className={`flex justify-items-center mr-24 z-10 ${modalVisible ? 'fixed top-0 left-0 w-full h-full bg-black/80 flex items-center justify-center pr-24' : ''}`}>
            <div className='flex justify-center mx-16 z-50 my-80'>
                <div className='flex items-center justify-center bg-gray-400/30 rounded-full border-4 border-gray-500/25 backdrop-blur-sm p-6 my-10'>
                    <div className={`flex h-24 w-24 items-center justify-center rounded-full border-2 border-white ${buttonActive === "Notepad" ? "bg-gray-500" : 'bg-gray-900/25 hover:border-4 hover:bg-gray-500'}`}>
                        <button className='h-16 w-16' title="Click Here" onClick={() => openModal("Notepad")}>
                            <img className='w-16 h-16' src={require('../img/block-note.png')} alt="logo"/>
                        </button>
                    </div>
                </div>
            </div>
            <div className='flex justify-items-center'>
                <div
                    className={`bg-gray-400/30 rounded-3xl ${modalVisible ? '' : 'border-4'} border-gray-500/25 backdrop-blur-sm pt-14`}>
                    <div className='mb-2.5 mx-10'>
                        <div className='flex flex-grow mr-64'>
                            <h1 className='text-4xl ml-2 text-white font-bold uppercase'>étape 3 : <span className='text-violet-400'>d</span>émonter
                                l'objection avec une histoire</h1>
                            <Chronometre chronoBackground={chronoBackground} chronoTextColor={chronoTextColor}
                                         formatTime={formatTime} time={time}/>
                        </div>
                        <div className='flex flex-col bg-gray-800/50 mt-16 rounded-2xl items-center'>
                            <div className='text-white pr-2 pl-2 mt-7 mb-8 mx-16'>
                                {modalVisible && renderModal()}
                                <div className='flex flex-col space-y-20 mr-1'>
                                    <div className='flex flex-grow justify-center items-center space-x-9'>
                                        <button onClick={onPrev}
                                            className='flex bg-gray-700/80 hover:bg-gray-700 text-gray-500 rounded-3xl font-bold text-lg px-28 py-5'>
                                            <div className='flex flex-col'>
                                                <div className='flex justify-center items-center'>
                                                    <div className='flex'>
                                                        <h1 className='text-xl uppercase'>Rassurer le <span
                                                            className='underline'>sur vous</span> !</h1>
                                                    </div>
                                                    <div>
                                                        <img className='h-10 w-10 ml-4'
                                                             src={require('../img/pointing.png')}
                                                             style={{ filter: 'brightness(0.5)' }}/>
                                                    </div>
                                                </div>
                                                <div className='flex flex-col mt-4 ml-10 space-y-4'>
                                                    <ButtonHistoryNotClic number={"1"}/>
                                                    <ButtonHistoryNotClic number={"2"}/>
                                                    <ButtonHistoryNotClic number={"3"}/>
                                                    <ButtonHistoryNotClic number={"4"}/>
                                                </div>
                                            </div>
                                        </button>
                                        <button
                                            className='flex bg-gray-400/80 text-white rounded-3xl font-bold text-lg px-24 py-7'>
                                            <div className='flex flex-col'>
                                                <div className='flex justify-center items-center'>
                                                <div className='flex'>
                                                        <h1 className='text-xl uppercase'>Rassurer le <span className='underline'>sur votre offre</span> !</h1>
                                                    </div>
                                                    <div>
                                                        <img className='h-10 w-10 ml-4'
                                                             src={require('../img/ampoule.png')}
                                                             alt="logo"/>
                                                    </div>
                                                </div>
                                                <div className='flex flex-col mt-4 ml-10 space-y-4'>
                                                    <div className='flex flex-grow space-x-10'>
                                                        <div
                                                            className='flex items-center bg-gray-300/50 rounded-full p-2'>
                                                            <img className='h-4 w-4 pl-1'
                                                                 src={require('../img/play.png')}
                                                                 alt="logo"/>
                                                        </div>
                                                        <div
                                                            className={`flex rounded-full justify-center px-5 items-center ${buttonActive === "History1" ? '' : ' hover:bg-gray-500'}`}>
                                                            <button className='text-xl'
                                                                    onClick={() => openModal("History1")}>Histoire 1
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-grow space-x-10'>
                                                        <div
                                                            className='flex items-center bg-gray-300/50 rounded-full p-2'>
                                                            <img className='h-4 w-4 pl-1'
                                                                 src={require('../img/play.png')}
                                                                 alt="logo"/>
                                                        </div>
                                                        <div
                                                            className={`flex rounded-full justify-center px-5 items-center ${buttonActive === "History2" ? '' : ' hover:bg-gray-500'}`}>
                                                            <button className='text-xl'
                                                                    onClick={() => openModal("History2")}>Histoire 2
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-grow space-x-10'>
                                                        <div
                                                            className='flex items-center bg-gray-300/50 rounded-full p-2'>
                                                            <img className='h-4 w-4 pl-1'
                                                                 src={require('../img/play.png')}
                                                                 alt="logo"/>
                                                        </div>
                                                        <div
                                                            className={`flex rounded-full justify-center px-5 items-center ${buttonActive === "History3" ? '' : ' hover:bg-gray-500'}`}>
                                                            <button className='text-xl'
                                                                    onClick={() => openModal("History3")}>Histoire 3
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className='flex flex-grow space-x-10'>
                                                        <div
                                                            className='flex items-center bg-gray-300/50 rounded-full p-2'>
                                                            <img className='h-4 w-4 pl-1'
                                                                 src={require('../img/play.png')}
                                                                 alt="logo"/>
                                                        </div>
                                                        <div
                                                            className={`flex rounded-full justify-center px-5 items-center ${buttonActive === "History4" ? '' : ' hover:bg-gray-500'}`}>
                                                            <button className='text-xl'
                                                                    onClick={() => openModal("History4")}>Histoire 4
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                    <div className='flex space-x-7'>
                                        <button
                                            className='flex bg-black/30 hover:bg-black/40 text-white rounded-3xl font-bold text-lg'>
                                            <div className='flex flex-grow mx-16 my-5'>
                                                <div className='flex flex-col'>
                                                    <div className='flex flex-grow'>
                                                        <div className='flex mt-3'>
                                                            <h1 className='text-lg'>Le client veut toujours quitter
                                                                l'appel ?</h1>
                                                        </div>
                                                        <div>
                                                            <img className='h-14 w-14'
                                                                 src={require('../img/man.png')}
                                                                 alt="logo"/>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className='flex items-center justify-center bg-gray-400/60 rounded-full mt-2'>
                                                        <h1 className='text-sm uppercase'>garder le dans la vente !</h1>
                                                        <div className='flex items-end'>
                                                            <img className='h-12 w-16 ml-5 py-0.5'
                                                                 src={require('../img/fleche.png')}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                        <button
                                            className='flex bg-violet-300/30 hover:bg-violet-400/30 text-white rounded-3xl font-bold text-lg'>
                                            <div className='flex flex-grow mx-24 my-5 mt-7'>
                                                <div className='flex flex-col'>
                                                    <div className='flex flex-grow justify-center'>
                                                        <div>
                                                            <h1 className='text-lg'>le client est partant ?</h1>
                                                        </div>
                                                        <div>
                                                            <img className='h-10 w-14 ml-4'
                                                                 src={require('../img/good.png')}
                                                                 alt="logo"/>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className='flex items-center justify-center bg-gray-400/60 rounded-full px-6 mt-4'>
                                                        <h1 className='text-sm uppercase'>terminez de conclure la vente
                                                            !</h1>
                                                        <div className='flex items-end'>
                                                            <img className='h-12 w-16 ml-5 py-0.5'
                                                                 src={require('../img/fleche.png')}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-5 mb-4 grid grid-cols-6 gap-2'>
                            <div className='flex col-end-11 space-x-3 col-span-3'>
                                <div className='flex mt-6 justify-end'>
                                    <button onClick={handleClickreturn2}
                                            className='flex bg-gray-400/80 hover:bg-gray-500 text-white font-bold py-2.5 px-3 rounded-full'>
                                        <img className='h-5 w-5 my-4 mr-4 ml-3 rotate-180'
                                             src={require('../img/play.png')}
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

    const handleClickReturn2 = () => {
        setStep(step - 4);
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
            {step === 16 && <QuizOnboardingStep16 onNext={handleNext} onPrev={handlePrev} handleHabitualClick={handleHabitualClick} time={time} formatTime={formatTime}/>}
            {step === 17 && <QuizOnboardingStep17 onNext={handleHabitualClick} onPrev={handlePrev} time={time} formatTime={formatTime}/>}
            {step === 18 && <QuizOnboardingStep18 onNext={handleNext} onPrev={handlePrev} handleHabitualClickReturn={handleHabitualClickReturn} time={time} formatTime={formatTime}/>}
            {step === 19 && <QuizOnboardingStep19 onNext={handleNext} onPrev={handleClickReturn} handleClickReturn={handleClickReturn} time={time} formatTime={formatTime}/>}
            {step === 20 && <QuizOnboardingStep20 onNext={handleNext} onPrev={handlePrev} handleHabitualClick={handleHabitualClick} time={time} formatTime={formatTime}/>}
            {step === 21 && <QuizOnboardingStep21 onNext={handleNext} onPrev={handlePrev} handleHabitualClick={handleHabitualClick} time={time} formatTime={formatTime}/>}
            {step === 22 && <QuizOnboardingStep22 onNext={handleNext} onPrev={handlePrev} handleHabitualClickReturn={handleHabitualClickReturn} handleHabitualClick={handleHabitualClick} time={time} formatTime={formatTime}/>}
            {step === 23 && <QuizOnboardingStep23 onNext={handleNext} onPrev={handleClickReturn} handleHabitualClick={handleHabitualClick} time={time} formatTime={formatTime}/>}
            {step === 24 && <QuizOnboardingStep24 onNext={handleNext} onPrev={handlePrev} handleClickreturn2={handleClickReturn2} handleHabitualClick={handleHabitualClick} time={time} formatTime={formatTime}/>}
        </div>
    )
}

export default QuizOnboarding;