import { useState, useEffect } from 'react';
import './Board.css';

/**
 * An individual cell from the N-Queens chess board.
 *
 * @typedef {object} CellProps
 * @property {number} rowIndex The row index of the cell in the board
 * @property {number} colIndex The column index of the cell in the board
 * @property {number[][]} board The chess board
 * @property {*} toggleQueen Callback when cell is clicked
 * 
 * @param {CellProps} props Component props
 * @returns {React.JSX.Element}
 */
function Cell({ rowIndex, colIndex, board, toggleQueen}) {
  // Is queen placed in this cell
  const [placed, setPlaced] = useState(board[rowIndex][colIndex] === 1);

  useEffect(() => {
    setPlaced(board[rowIndex][colIndex] === 1);
  }, [board, rowIndex, colIndex]);

  return (
    <div
      className={`board-cell ${(rowIndex + colIndex) % 2 === 0 ? 'even' : 'odd'}`}
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

/**
 * The N-Queens chess board.
 * 
 * @typedef {object} BoardProps
 * @property {number[][]} board The board array that is being display
 * @property {*} setBoard The callback to update the board array
 * 
 * @param {BoardProps} props Component props
 * @returns {React.JSX.Element}
 */
function Board({ board, setBoard }) {
  /**
   * Toggle placement of a queen at a given row and column.
   * @param {number} row The row to toggle queen placement
   * @param {number} col The column to toggle queen placement
   * @param {boolean} placed To set the placement of a queen
   */
  const toggleQueen = (row, col, placed) => {
    let newBoard = board;
    newBoard[row][col] = placed ? 1 : 0;
    setBoard(newBoard);
  }

  return (
    <div
      className='board-grid'
      style={{gridTemplateColumns: `repeat(${board.length}, 40px)`}}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            rowIndex={rowIndex}
            colIndex={colIndex}
            board={board}
            toggleQueen={toggleQueen}
          />
        ))
      )}
    </div>
  );
}

export default Board;
