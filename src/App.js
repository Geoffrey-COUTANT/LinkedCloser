import React from 'react';
import QuizOnboarding from "./components/QuizOnboarding/QuizOnboarding";


function App() {
  return (
      <div className='flex justify-center items-center h-screen w-screen '>
          <div className='rounded-lg'>
            <QuizOnboarding />
          </div>
      </div>
  );
}

export default App;
