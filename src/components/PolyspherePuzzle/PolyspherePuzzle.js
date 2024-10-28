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
    
    const messageHandler = (e) => {
      const { success, solution, error } = e.data;
      
      if (success && solution) {
        let currentStep = 0;
        const totalSteps = solution.length;
        
        const animateSolution = () => {
          if (currentStep < totalSteps) {
            setBoard(prevBoard => {
              return prevBoard.map((row, i) => 
                row.map((cell, j) => 
                  solution[i][j] !== "" ? solution[i][j] : cell
                )
              );
            });
            currentStep++;
            setTimeout(animateSolution, 100);
          }
        };
        
        animateSolution();
      } else {
        setError(error || "No solution found! Try clearing the board and starting over.");
      }
      
      setIsSolving(false);
      worker.removeEventListener('message', messageHandler);
    };

    const errorHandler = (error) => {
      console.error("Worker error:", error);
      setError("An error occurred while solving the puzzle.");
      setIsSolving(false);
      worker.removeEventListener('error', errorHandler);
    };

    worker.addEventListener('message', messageHandler);
    worker.addEventListener('error', errorHandler);
    
    worker.postMessage({ board, pieces: shapes });
  }, [worker, board, shapes]);

  const handleClear = useCallback(() => {
    setBoard(Array(5).fill().map(() => Array(11).fill("")));
    setShapes(pieces);
    setSelectedShape(pieces[0]);
    setError(null);
  }, []);

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
        <div className="button-group">
          <button 
            onClick={handleSolve} 
            disabled={isSolving}
            className={`puzzle-button solve-button ${isSolving ? 'disabled' : ''}`}
          >
            {isSolving ? "Solving..." : "Solve Puzzle"}
          </button>
          
          <button 
            onClick={handleClear}
            disabled={isSolving}
            className={`puzzle-button clear-button ${isSolving ? 'disabled' : ''}`}
          >
            Clear Board
          </button>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
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