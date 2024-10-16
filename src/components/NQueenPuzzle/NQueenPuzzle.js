import { useState } from 'react';
import Board from '../Board/Board';
import { solveNQueens } from '../../lib/nqueens';
import './NQueenPuzzle.css';

/**
 * Creates an empty chess board.
 * @param {number} size The size (N) of the N x N chess board
 * @returns {number[][]} A 2-dimensional array filled with zeros
 */
function createBoard (size) {
  return Array(size).fill().map(() => Array(size).fill(0));
}

/**
 * Displays the N-Queens puzzle solver.
 * @returns {React.JSX.Element}
 */
function NQueenPuzzle() {
  const [boardSize, setBoardSize] = useState(4);
  const [board, setBoard] = useState(createBoard(boardSize));
  const [solved, setSolved] = useState(false);

  /**
   * Attempts to solve the N-Queens problem using the board.
   */
  const solveBoard = () => {
    // Create a copy of the chess board
    const copyBoard = Array.from(board);
    // Attempt to solve NQueens
    const isSolved = solveNQueens(copyBoard);
    setSolved(isSolved);
    if (isSolved) {
      // Show completed board if successful
      setBoard(copyBoard);
    } else {
      alert("No possible Solutions found");
    }
  }

  /**
   * Clears the board.
   */
  const clearBoard = () => {
    // Reset board
    const newBoard = createBoard(boardSize);
    setBoard(newBoard);
    // Reset solved status
    setSolved(false);
  }

  /**
   * Resizes the board based on the board-size input.
   * @param {*} e Event
   */
  const resizeBoard = (e) => {
    // Update the board size
    const newSize = Math.max(1, parseInt(e.target.value) || 0);
    setBoardSize(newSize);
    // Reset the board
    const newBoard = createBoard(newSize);
    setBoard(newBoard);
    // Reset solved status
    setSolved(false);
  }

  return (
    <div className="puzzleOne">
      <h2>The N-Queen Puzzle</h2>
      <div className="input-section">
        <label htmlFor="board-size">Board Size:</label>
        <input
          type="number"
          id="board-size"
          value={boardSize}
          onChange={resizeBoard}
          min={1}
        />
        <button onClick={solveBoard}>Solve</button>
        <button onClick={clearBoard}>Clear</button>
      </div>
      {solved && <h2>Solution found</h2>}
      <div className="board-section">
        <Board board={board} setBoard={setBoard} />
      </div>
    </div>
  )
}

export default NQueenPuzzle;
