import './PolyspherePuzzle.css';
import { useState, useCallback, useEffect } from 'react';
import PolyBoard from '../PolyBoard/PolyBoard';
import PieceSelector from '../PieceSelector/PieceSelector';
import pieces from '../../lib/pieces';

function PolyspherePuzzle() {
  const [board, setBoard] = useState(Array(5).fill().map(() => Array(11).fill("")));
  const [shapes, setShapes] = useState(pieces);
  const [selectedShape, setSelectedShape] = useState(shapes[0]);
  const [isSolving, setIsSolving] = useState(false);
  const [worker, setWorker] = useState(null);
  const [error, setError] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [solverMessage, setSolverMessage] = useState('');

  useEffect(() => {
    try {
      const newWorker = new Worker(new URL('../../lib/puzzleSolver.worker.js', import.meta.url));
      setWorker(newWorker);

      return () => {
        newWorker.terminate();
      };
    } catch (err) {
      console.error('Failed to create Web Worker:', err);
      setError('Failed to initialize puzzle solver');
    }
  }, []);

  const handleSolve = useCallback(() => {
    if (!worker) {
      setError('Puzzle solver is not initialized');
      return;
    }

    setIsSolving(true);
    setError(null);
    setProgress(0);
    setSolutions([]);
    setSolverMessage('Solving...');
    
    const messageHandler = (e) => {
      const { type, success, solutions: newSolutions, error: workerError, progress: workerProgress, message } = e.data;
      
      if (type === 'progress') {
        setProgress(workerProgress);
        setSolverMessage("Solutions found so far...");
        return;
      }
      
      if (success && newSolutions?.length > 0) {
        setSolutions(newSolutions);
        setBoard(newSolutions[0]);
        setCurrentSolutionIndex(0);
        setProgress(100);
        setSolverMessage(message || `Found ${newSolutions.length} solutions!`);
      } else {
        setError(workerError || "No solutions found!");
        setSolverMessage('');
      }
      
      setIsSolving(false);
      worker.removeEventListener('message', messageHandler);
    };

    worker.addEventListener('message', messageHandler);
    worker.postMessage({ board, pieces: shapes });
  }, [worker, board, shapes]);

  const handleClear = useCallback(() => {
    setBoard(Array(5).fill().map(() => Array(11).fill("")));
    setShapes(pieces);
    setSelectedShape(pieces[0]);
    setError(null);
    setSolutions([]);
    setProgress(0);
    setSolverMessage('');
  }, []);

  const handleNextSolution = useCallback(() => {
    if (currentSolutionIndex < solutions.length - 1) {
      setCurrentSolutionIndex(prev => prev + 1);
      setBoard(solutions[currentSolutionIndex + 1]);
    }
  }, [currentSolutionIndex, solutions]);

  const handlePreviousSolution = useCallback(() => {
    if (currentSolutionIndex > 0) {
      setCurrentSolutionIndex(prev => prev - 1);
      setBoard(solutions[currentSolutionIndex - 1]);
    }
  }, [currentSolutionIndex, solutions]);

  return (
    <div className="puzzleTwo">
      <h2>The Polysphere Puzzle</h2>
      <p>
        This puzzle involves placing unique shapes made of connected spheres
        onto a 5x11 board. Your goal is to fit all 12 pieces perfectly into the grid.
        Each shape is made from a different configuration of spheres, and you can use the
        'Solve' button to find the best way to complete the board.
      </p>
      
      <div className="controls-container">
        <button onClick={handleSolve} disabled={isSolving}>
          {isSolving ? "Solving..." : "Solve Puzzle"}
        </button>
        <button onClick={handleClear} disabled={isSolving}>Clear Board</button>

        {solverMessage && (
          <div className="solver-message">
            {solverMessage}
          </div>
        )}

        {progress > 0 && progress < 100 && (
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
            <span>{Math.round(progress)}%</span>
          </div>
        )}

        {solutions.length > 1 && (
          <div className="solution-navigation">
            <button 
              onClick={handlePreviousSolution} 
              disabled={currentSolutionIndex === 0}
            >
              Previous Solution
            </button>
            <span>Solution {currentSolutionIndex + 1} of {solutions.length}</span>
            <button 
              onClick={handleNextSolution} 
              disabled={currentSolutionIndex === solutions.length - 1}
            >
              Next Solution
            </button>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>

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
    </div>
  );
}

export default PolyspherePuzzle;