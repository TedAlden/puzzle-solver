import { useState } from 'react';
import Board from '../Board/Board';
import { solveNQueens } from '../../lib/nqueens';
import './NQueenPuzzle.css';

function createBoard (size) {
  return Array(size).fill().map(() => Array(size).fill(0));
}

function NQueenPuzzle() {
  const [boardSize, setBoardSize] = useState(4);
  const [board, setBoard] = useState(createBoard(boardSize));
  const [solved, setSolved] = useState(false);

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

  const clearBoard = () => {
    // Reset board
    const newBoard = createBoard(boardSize);
    setBoard(newBoard);
    // Reset solved status
    setSolved(false);
  }

  const resizeBoard = (e) => {
    // Update the board size
    const newSize = parseInt(e.target.value);
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
          min={4}
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
