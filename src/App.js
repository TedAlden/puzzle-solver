import React, { useState } from 'react';
import './App.css';
import solveNQueens from './lib/nqueens';

function App() {
  // State Variables
  const [boardSize, setBoardSize] = useState(4);
  const [board, setBoard] = useState(Array.from({ length: 4 }, () => Array(4).fill(0)));
  const [solved, setSolved] = useState(false);

  // Function to Solve puzzle
  const runSolve = () => {
    // Create a copy of the chess board
    const copyBoard = board.map(row => [...row]);
    const isSolved = solveNQueens(copyBoard);
    console.log(copyBoard);
    if (isSolved) {
      setBoard(copyBoard); // Update the board state with the solution
      setSolved(true);     // Set solved to true
    } else {
      alert("No possible Solutions found");
      setSolved(false);    // Set solved to false
    }
  };

  // Change the board size
  const changeSize = (e) => {
    const newSize = parseInt(e.target.value);
    setBoardSize(newSize);  // Update the board size
    setBoard(Array.from({ length: newSize }, () => Array(newSize).fill(0))); // Reset the board
    setSolved(false);  // Reset solved status
  };

  return (
    <div className="App">
      <header className="App-header">   
        <h2>Welcome to the puzzle solver!</h2>
      </header>

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
        </div>

        <div className="board-section">
          {solved && <h2>Solution found</h2>}
          <Board board={board} />
        </div>
      </div>
    </div>
  );
}

// Component to render the board
function Board({ board }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${board.length}, 40px)`,
        gap: '5px',
        marginTop: '20px',
      }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, cellIndex) => (
          <div
            key={`${rowIndex}-${cellIndex}`}
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: (rowIndex + cellIndex) % 2 === 0 ? 'white' : 'gray',
              border: '1px solid black',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {cell === 1 ? <span style={{ color: 'black' }}>♛</span> : ''} 
          </div>
        ))
      )}
    </div>
  );
}

export default App;
