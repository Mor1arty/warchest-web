import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Game from './components/Game/Game';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-stone-100">
        <Routes>
          <Route path="/" element={<Game />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
