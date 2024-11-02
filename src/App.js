import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import NQueenPuzzle from './components/NQueenPuzzle/NQueenPuzzle';
import PolyspherePuzzle from './components/PolyspherePuzzle/PolyspherePuzzle';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/nqueen">The N-Queens Puzzle</Link>
          <Link to="/polysphere">Polysphere Puzzle</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nqueen" element={<NQueenPuzzle />} />
          <Route path="/polysphere" element={<PolyspherePuzzle />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
