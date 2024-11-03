import './PolyspherePuzzle.css';
import { useState, useEffect } from 'react';
import PolyBoard from '../PolyBoard/PolyBoard';
import PieceSelector from '../PieceSelector/PieceSelector';
import pieces from '../../lib/pieces';
import createPolysphereWorker from '../../workers/createPolysphereWorker';
import normalise from '../PieceSelector/PieceSelector';

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

  const [moveStack, setMoveStack] = useState([]);

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
    setMoveStack([]);
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

  const addMove = (board, piece) => {
    setMoveStack(prev => [...prev, { board, piece }]);
  };

  const handleUndo = () => {
      if (moveStack.length > 0) {
    setMoveStack(prev => {
      const newStack = [...prev];
      const lastMove = newStack.pop();
      
      // Restore the board to the previous state
      setBoard(lastMove.board);
      
      // Restore the piece to availabe pieces
      if (lastMove.piece) {
        setShapes(prev => [...prev, lastMove.piece]);
        setSelectedShape(lastMove.piece);
      }
      
      return newStack;
    });
  }
};


  const ProgressTracker = ({ totalPieces, placedPieces }) => {
    const progress = (placedPieces / totalPieces) * 100;
    
    return (
      <div className="progress-tracker">
        <div className="progress-stats">
          <div className="progress-text">
            <span className="progress-label">Progress:</span>
            <span className="progress-count">
              {placedPieces} of {totalPieces} pieces placed
            </span>
          </div>
          <span className="progress-percentage">{Math.round(progress)}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
      </div>
    );
  };
  

//Keyboard input
useEffect(() => {
  const handleKeyDown = (e) => {
    if (['r', 'f', 's', 'u', 'ArrowLeft', 'ArrowRight', 'Escape'].includes(e.key)) {
      e.preventDefault();
    }

    if (isSolving) return;

    switch (e.key.toLowerCase()) {
      case 'r':
        // Rotate piece
        if (selectedShape) {
          const newShape = {...selectedShape};
          newShape.coords = normalise(newShape.coords.map(([x, y]) => [y, -x]));
          setSelectedShape(newShape);
        }
        break;

        case's':
        // Solve puzzle
        handleSolve();
        break;

        case 'u':
          // undo
          handleUndo();
          break;
      
      case 'f':
        // Flip piece
        if (selectedShape) {
          const newShape = {...selectedShape};
          newShape.coords = normalise(newShape.coords.map(([x, y]) => [-x, y]));
          setSelectedShape(newShape);
        }
        break;
      
      case 'arrowleft':
        // Previous piece
        if (shapes.length > 0) {
          const currentIndex = shapes.findIndex(
            shape => shape.symbol === selectedShape.symbol
          );
          const newIndex = (currentIndex - 1 + shapes.length) % shapes.length;
          setSelectedShape(shapes[newIndex]);
        }
        break;

      case 'arrowright':
        // Next piece
        if (shapes.length > 0) {
          const currentIndex = shapes.findIndex(
            shape => shape.symbol === selectedShape.symbol
          );
          const newIndex = (currentIndex + 1) % shapes.length;
          setSelectedShape(shapes[newIndex]);
        }
        break;

      case 'escape':
        handleClear();
        break;

      default:
        break;
    }
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [selectedShape, shapes, isSolving, moveStack]);



  return (
    <div className="puzzleTwo">
      <h2>The Polysphere Puzzle</h2>
      <p>
        The <b> polysphere puzzle </b> involves placing <b> 12 </b>
        unique shapes made of connected spheres onto a <b> 5x11 </b>
        board. Your goal is to fit all pieces perfectly into the grid.
        Each shape is made from a different configuration of spheres,
        and you can use the <b> Solve </b> button to find the best way
        to complete the board.
      </p>
      <ProgressTracker
      totalPieces ={12}
      placedPieces={12 - shapes.length}
      />
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
        isSolving={isSolving}
        addMove={addMove}
      />
     <div className="controlsContainer">
        <button onClick={handleSolve} disabled={isSolving}>
          {isSolving ? "Solving..." : "Solve Puzzle"}
        </button>
        <button onClick={handleClear} disabled={isSolving}>
          Clear Board
        </button>
        <button onClick={handleUndo} disabled={moveStack.length === 0 || isSolving}>
          Undo
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

  <div className="keyboard-controls">
    <p>Keyboard Controls</p>
    <ul>
      <li>R : Rotate piece</li>
      <li>F : Flip piece</li>
      <li>← : Previous piece</li>
      <li>→ : Next piece</li>
      <li>U : Undo</li>
      <li>S : Solve puzzle</li>
      <li>ESC : Clear board</li>
    </ul>
  </div>
      </div>
    </div>

  );
  
}

export default PolyspherePuzzle;
