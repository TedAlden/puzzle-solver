import './Board.css';
import Cell from '../Cell/Cell';

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
