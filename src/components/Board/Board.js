import './Board.css';
import { useState } from 'react';

function Cell({ isEven, isQueen, onMouseClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      role="cell"
      className={`board-cell ${isEven ? 'even' : 'odd'} ${isHovered ? 'hovered' : ''}`}
      onClick={onMouseClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isQueen && <span className="board-queen">♛</span>}
    </div>
  )
}

function Board({ board, setBoard }) {
  const toggleQueen = (row, col) => {
    const newValue = board[row][col] === 1 ? 0 : 1;
    setBoard(board.map((r, i) =>
      i === row ? r.map((c, j) => (j === col ? newValue : c)) : r
    ));
  }

  return (
    <div
      role="grid"
      className='board-grid'
      style={{ gridTemplateColumns: `repeat(${board.length}, 50px)` }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            isEven={(rowIndex + colIndex) % 2 === 0}
            isQueen={cell === 1}
            onMouseClick={() => toggleQueen(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
}

export default Board;
