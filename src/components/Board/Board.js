import { useState, useEffect } from 'react';
import './Board.css';

function Cell({ rowIndex, colIndex, board, toggleQueen}) {
// Is queen placed in this cell
  const [placed, setPlaced] = useState(board[rowIndex][colIndex] === 1);

  useEffect(() => {
    setPlaced(board[rowIndex][colIndex] === 1);
  }, [board]);

  return (
    <div
      className={`board-cell ${(rowIndex + colIndex) % 2 === 0 ? 'even' : 'odd'}`}
      key={`${rowIndex}-${colIndex}`}
      onClick={() => {
        let newState = !placed;
        setPlaced(newState);
        toggleQueen(rowIndex, colIndex, newState);
      }}
    >
      {placed ? <span className='board-queen'>♛</span> : ''}
    </div>
  )
}

function Board({ board, setBoard }) {
  const toggleQueen = (row, col, placed) => {
    let newBoard = board;
    newBoard[row][col] = placed ? 1 : 0;
    setBoard(newBoard);
    console.log(newBoard)
  }

  return (
    <div
      className='board-grid'
      style={{gridTemplateColumns: `repeat(${board.length}, 40px)`}}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell rowIndex={rowIndex} colIndex={colIndex} board={board} toggleQueen={toggleQueen}/>
        ))
      )}
    </div>
  );
}

export default Board;
