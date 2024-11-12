import "./PolyspherePuzzle.css";
import { useState, useEffect } from "react";
import PolyBoard from "../../components/PolyBoard/PolyBoard";
import PieceSelector from "../../components/PieceSelector/PieceSelector";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import KeyboardControls from "../../components/KeyboardControls/KeyboardControls";
import pieces from "../../lib/pieces";
import createPolysphereWorker from "../../workers/createPolysphereWorker";
import { createBoard2D } from "../../lib/utils";

/**
 * A component displaying the polysphere puzzle solver, including the board,
 * shape selector, and input controls.
 *
 * @returns {React.JSX.Element}
 */
function PolyspherePuzzle() {
  const [board, setBoard] = useState(createBoard2D(11, 5, ""));
  const [shapes, setShapes] = useState(pieces);
  const [selectedShape, setSelectedShape] = useState(shapes[0]);

  const [isSolving, setIsSolving] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  const [worker, setWorker] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [solutionIndex, setSolutionIndex] = useState(0);

  const [moveStack, setMoveStack] = useState([]);

  // Start a background worker (much like a thread) with the polysphere solver,
  // since it takes a long time to run and will otherwise freeze the React app.
  useEffect(() => {
    try {
      const newWorker = createPolysphereWorker();
      setWorker(newWorker);
      // Cleanup worker
      return () => {
        newWorker.terminate();
      };
    } catch (err) {
      console.error("Failed to create Web Worker:", err);
    }
  }, []);

  // Update board when solution changes
  useEffect(() => {
    if (solutions[solutionIndex]) {
      setBoard(solutions[solutionIndex]);
    }
  }, [solutions, solutionIndex]);

  /**
   * Handle clicking the solve button. Starts the puzzle solver using a
   * background worker. Updates the solutions array as the worker finds new
   * solutions.
   */
  const handleSolve = () => {
    if (!worker) return;
    // Handler for when the worker sends a solution back here
    const messageHandler = (e) => {
      if (e.data.type === "solution") {
        setSolutions((prev) => [...prev, e.data.data]);
      }
      if (e.data.type === "complete") {
        setIsSolved(true);
        setIsSolving(false);
        // Remove 'onMessage' handler when worker is complete
        worker.removeEventListener("message", messageHandler);
      }
    };
    setIsSolving(true);
    // Attach 'onMessage' event listener
    worker.addEventListener("message", messageHandler);
    // Send the current board configuration and pieces to the solver
    worker.postMessage({ board, pieces });
  };

  /**
   * Handle clicking the clear button. Resets the board and game state.
   */
  const handleClear = () => {
    setBoard(createBoard2D(11, 5, ""));
    setShapes(pieces);
    setSelectedShape(pieces[0]);
    setSolutions([]);
    setSolutionIndex(0);
    setIsSolved(false);
    setIsSolving(false);
    setMoveStack([]);
  };

  /**
   * Handle clicking the next solution button. Skips to the next solution in
   * the solution set.
   */
  const handleNextSolution = () => {
    if (solutionIndex < solutions.length - 1) {
      setSolutionIndex((prev) => prev + 1);
      setBoard(solutions[solutionIndex + 1]);
    }
  };

  /**
   * Handle clicking the previous solution button. Returns to the previous
   * solution in the solution set.
   */
  const handlePreviousSolution = () => {
    if (solutionIndex > 0) {
      setSolutionIndex((prev) => prev - 1);
      setBoard(solutions[solutionIndex - 1]);
    }
  };

  /**
   * Handle clicking the undo button. Reverts the board to the previous move
   * and restores the piece.
   */
  const handleUndo = () => {
    if (moveStack.length > 0) {
      setMoveStack((prev) => {
        const newStack = [...prev];
        const lastMove = newStack.pop();
        // Restore the board to the previous state
        setBoard(lastMove.board);
        // Restore the piece to availabe pieces
        if (lastMove.piece) {
          setShapes((prev) => [...prev, lastMove.piece]);
          setSelectedShape(lastMove.piece);
        }
        return newStack;
      });
    }
  };

  /**
   * Adds a move to the move stack, enabling undo functionality.
   *
   * @param {Array<Array<string>>} board The current board state.
   * @param {Object} piece The current piece being placed.
   */
  const addMove = (board, piece) => {
    setMoveStack((prev) => [...prev, { board, piece }]);
  };

  return (
    <div className="puzzleTwo">
      <h2>The Polysphere Puzzle</h2>
      <p>
        The <b> polysphere puzzle </b> involves placing <b> 12 </b> unique
        shapes made of connected spheres onto a <b> 5x11 </b> board. Your goal
        is to fit all pieces perfectly into the grid. Each shape is made from a
        different configuration of spheres, and you can use the <b> Solve </b>
        button to find the best way to complete the board.
      </p>
      <ProgressBar current={12 - shapes.length} total={12} />
      {shapes.length > 0 && (
        <PieceSelector
          shapes={shapes}
          selectedShape={selectedShape}
          setSelectedShape={setSelectedShape}
        />
      )}
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
        <button
          onClick={handleUndo}
          disabled={moveStack.length === 0 || isSolving}
        >
          Undo
        </button>
      </div>
      <div>
        {isSolving && <span>Solving ⏳</span>}
        {isSolved && solutions.length > 0 && <span>Solutions found ✅</span>}
        {isSolved && solutions.length === 0 && <span>No solutions ⚠️</span>}
        {solutions.length >= 1 && (
          <div className="solutionNavigation">
            <button
              onClick={handlePreviousSolution}
              disabled={solutionIndex === 0}
            >
              Previous Solution
            </button>
            <span>
              Solution {solutionIndex + 1} of {solutions.length}
            </span>
            <button
              onClick={handleNextSolution}
              disabled={solutionIndex === solutions.length - 1}
            >
              Next Solution
            </button>
          </div>
        )}
      </div>
      <KeyboardControls
        selectedShape={selectedShape}
        setSelectedShape={setSelectedShape}
        shapes={shapes}
        isSolving={isSolving}
        handleSolve={handleSolve}
        handleUndo={handleUndo}
        handleClear={handleClear}
      />
    </div>
  );
}

export default PolyspherePuzzle;
