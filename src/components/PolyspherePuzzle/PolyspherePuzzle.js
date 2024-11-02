import './PolyspherePuzzle.css';
import { useState, useEffect } from 'react';
import PolyBoard from '../PolyBoard/PolyBoard';
import PieceSelector from '../PieceSelector/PieceSelector';
import pieces from '../../lib/pieces';
import createPolysphereWorker from '../../workers/createPolysphereWorker';

const createBoard = (width, height) => (
  Array(height).fill().map(
    () => Array(width).fill("")
  )
);

function PolyspherePuzzle() {
  const [board, setBoard] = useState(createBoard(11, 5));
  const [shapes, setShapes] = useState(pieces);
  const [selectedShape, setSelectedShape] = useState(shapes[0]);

  const [isSolving, setIsSolving] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  const [worker, setWorker] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [solutionIndex, setSolutionIndex] = useState(0);

  useEffect(() => {
    // Start a background worker (much like a thread) with the
    // polysphere solver, since it takes a long time to run and will
    // otherwise freeze the React app.
    try {
      const newWorker = createPolysphereWorker();
      setWorker(newWorker);
      // Cleanup worker
      return () => {
        newWorker.terminate();
      };
    } catch (err) {
      console.error('Failed to create Web Worker:', err);
    }
  }, []);

  useEffect(() => {
    if (solutions[solutionIndex]) {
      setBoard(solutions[solutionIndex]);
    }
  }, [solutions, solutionIndex]);

  const handleSolve = () => {
    if (!worker) return;
    // Handler for when the worker sends a solution back here
    const messageHandler = e => {
      if (e.data.type === 'solution') {
        setSolutions(prev => [...prev, e.data.data]);
      }
      if (e.data.type === 'complete') {
        setIsSolved(true);
        setIsSolving(false);
        // Remove 'onMessage' handler when worker is complete
        worker.removeEventListener('message', messageHandler);
      }
    }
    setIsSolving(true);
    // Attach 'onMessage' event listener
    worker.addEventListener('message', messageHandler);
    // Send the current board configuration and pieces to the solver
    worker.postMessage({ board, pieces });
  }

  const handleClear = () => {
    setBoard(createBoard(11, 5));
    setShapes(pieces);
    setSelectedShape(pieces[0]);
    setSolutions([]);
    setSolutionIndex(0);
    setIsSolved(false);
    setIsSolving(false);
  };

  const handleNextSolution = () => {
    if (solutionIndex < solutions.length - 1) {
      setSolutionIndex(prev => prev + 1);
      setBoard(solutions[solutionIndex + 1]);
    }
  };

  const handlePreviousSolution = () => {
    if (solutionIndex > 0) {
      setSolutionIndex(prev => prev - 1);
      setBoard(solutions[solutionIndex - 1]);
    }
  };

  return (
    <div className="puzzleTwo">
      <h2>The Polysphere Puzzle</h2>
      <p>
        This puzzle involves placing unique shapes made of connected
        spheres onto a 5x11 board. Your goal is to fit all 12 pieces
        perfectly into the grid. Each shape is made from a different
        configuration of spheres, and you can use the 'Solve' button to
        find the best way to complete the board.
      </p>
      <PieceSelector
        shapes={shapes}
        selectedShape={selectedShape}
        setSelectedShape={setSelectedShape}
      />
      <PolyBoard
        board={board}
        setBoard={setBoard}
        selectedShape={selectedShape}
        setSelectedShape={setSelectedShape}
        shapes={shapes}
        setShapes={setShapes}
      />
      <div className="controlsContainer">
        <button onClick={handleSolve} disabled={isSolving}>
          {isSolving ? "Solving..." : "Solve Puzzle"}
        </button>
        <button onClick={handleClear} disabled={isSolving}>
          Clear Board
        </button>
      </div>
      <div>
        {isSolving &&
          <span>Solving ⏳</span>
        }
        {isSolved && solutions.length > 0 &&
          <span>Solutions found ✅</span>
        }
        {isSolved && solutions.length === 0 &&
          <span>No solutions ⚠️</span>
        }
        {solutions.length >= 1 &&
          <div className="solutionNavigation">
            <button
              onClick={handlePreviousSolution}
              disabled={solutionIndex === 0}
            >
              Previous Solution
            </button>
            <span>Solution {solutionIndex + 1} of {solutions.length}</span>
            <button
              onClick={handleNextSolution}
              disabled={solutionIndex === solutions.length - 1}
            >
              Next Solution
            </button>
          </div>
        }
      </div>
    </div>
  );
}

export default PolyspherePuzzle;
