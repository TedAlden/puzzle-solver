import { useState } from 'react';
import Board from '../Board/Board';
import { solveNQueens } from '../../lib/nqueens';
import './NQueenPuzzle.css';

function NQueenPuzzle() {
  // State Variables
  const [boardSize, setBoardSize] = useState(4);
  const [board, setBoard] = useState(Array.from({ length: 4 }, () => Array(4).fill(0)));
  const [solved, setSolved] = useState(false);

  const runSolve = () => {
    // Create a copy of the chess board and attempt to solve
    const copyBoard = board.map(row => [...row]);
    const isSolved = solveNQueens(copyBoard);
    if (isSolved) {
      setBoard(copyBoard);  // Update the board state with the solution
      setSolved(true);
      console.log(copyBoard)
    } else {
      alert("No possible Solutions found");
      setSolved(false);
    }
  };
  
  const clearBoard = () => {
    const newBoard = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
    setBoard(newBoard);
    setSolved(false);
  }

  const changeSize = (e) => {
    const newSize = parseInt(e.target.value);
    const newBoard = Array.from({ length: newSize }, () => Array(newSize).fill(0));
    setBoardSize(newSize);  // Update the board size
    setBoard(newBoard);     // Reset the board
    setSolved(false);       // Reset solved status
  };

  return (
    <div className="puzzleOne">
      <h2>The N-Queen Puzzle</h2>
      <div className="input-section">
        <label htmlFor="board-size">Board Size:</label>
        <input
          type="number"
          id="board-size"
          value={boardSize}
          onChange={changeSize}
          min={4}
        />
        <button onClick={runSolve}>Solve</button>
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
