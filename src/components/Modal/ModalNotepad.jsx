import React, {useEffect, useState} from "react";
import axios from "axios";

function ModalNotepad({ closeModal }) {
    const [inputs, setInputs] = useState([]);
    const [userName, setUserName] = useState('');

    const fetchUserInputs = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5058/userInputs/${userId}`);
            setInputs(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des réponses de l'utilisateur:", error);
        }
    };

    useEffect(() => {
        fetchUserInputs(localStorage.getItem('userId'));
    }, []);

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
        <div className='fixed inset-0 flex items-center rounded-3xl justify-center bg-black/70 z-40'>
            <div className='bg-gray-500 mx-14 rounded-2xl relative border-4 border-gray-600/50'>
                <div className='mb-2.5 mx-16'>
                    <div className='flex flex-col mt-5'>
                        <h1 className='text-3xl text-center font-bold'>Suivi des réponses de {userName}</h1>
                        {(
                            <div className='mt-9 bg-gray-800/30 p-6 rounded-2xl'>
                                <h1 className='flex flex-grow text-2xl mb-2 font-bold'><img className='mr-2' src={require('../img/cocheGood.png')}
                                                                             alt="logo"/>Réponses:</h1>
                                <ul style={{ maxHeight: '335px', overflowY: 'auto' }}>
                                    {inputs
                                        .sort((a, b) => a.id - b.id)
                                        .map((input, index ) => (
                                        <li className='mt-1' key={input.id}>- {input.input ?? input.choice}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className='mt-10 mb-4 grid grid-cols-6 gap-2'>
                        <div className='col-end-11 col-span-2'>
                            <button onClick={closeModal}
                                    className='flex bg-gray-400/80 hover:bg-gray-400 text-white font-bold ml-64 py-4 px-7 rounded-full uppercase text-lg'>fermer le “récapitulatif” et revenir au script
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