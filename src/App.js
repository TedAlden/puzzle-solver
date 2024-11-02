import './App.css';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import Home from './components/Home/Home';
import NQueenPuzzle from './components/NQueenPuzzle/NQueenPuzzle';
import PolyspherePuzzle from './components/PolyspherePuzzle/PolyspherePuzzle';

function App() {
  return (
    <div className="App">
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nqueen" element={<NQueenPuzzle />} />
          <Route path="/polysphere" element={<PolyspherePuzzle />} />
        </Routes>
      </MemoryRouter>
    </div>
  );
}

export default App;
