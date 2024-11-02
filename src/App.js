import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';

import Home from './components/Home/Home';
import NQueenPuzzle from './components/NQueenPuzzle/NQueenPuzzle';
import PolyspherePuzzle from './components/PolyspherePuzzle/PolyspherePuzzle';

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nqueen" element={<NQueenPuzzle />} />
          <Route path="/polysphere" element={<PolyspherePuzzle />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
