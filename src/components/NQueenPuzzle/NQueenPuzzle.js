import { useState } from 'react';
import Board from '../Board/Board';
import { solveNQueens } from '../../lib/nqueens';
import './NQueenPuzzle.css';

/**
 * Creates an empty chess board.
 * @param {number} size The size (N) of the N x N chess board
 * @returns {number[][]} A 2-dimensional array filled with zeros
 */
const createBoard = (size) => (
  Array(size).fill().map(
    () => Array(size).fill(0)
  )
);

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
    // Create a copy of the chess board and attempt to solve
    const newBoard = [...board];
    const isSolved = solveNQueens(newBoard);
    setSolved(isSolved);
    if (isSolved) {
      // Show completed board if successful
      setBoard(newBoard);
    } else {
      alert("No possible Solutions found");
    }
  }

  /**
   * Clears the board and resets the solved status to false.
   */
  const clearBoard = () => {
    setBoard(createBoard(boardSize));
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
    setBoard(createBoard(newSize));
    // Reset solved status
    setSolved(false);
  }

  return (
    <div className="puzzleOne">
      <h2>The N-Queens Puzzle</h2>
      <p>
        The <b> N-Queens Problem </b> is a puzzle that involves placing
        <b> N </b> queens on an <b> N x N </b> chessboard in such a way
        that no two queens can attack each other - meaning no two queens
        share the same row, column, or diagonal. In this app, you can
        place some of the queens manually, and the algorithm will
        attempt to solve the rest of the puzzle for you.
      </p>
      <p>
        Simply place your queens, click the <b> Solve </b> button, and
        the algorithm will find the remaining valid positions for the
        queens.
      </p>
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
