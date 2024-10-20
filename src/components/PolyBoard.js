import { useState, useEffect } from 'react';
import './PolyBoard.css';

/**
 * Represents an individual cell of the 5x11 board for the polysphere puzzle.
 *
 * @typedef {object} CellProps
 * @property {number} rowIndex The row index of the cell in the board
 * @property {number} colIndex The column index of the cell in the board
 * @property {number[][]} board The 5x11 puzzle board
 
 *
 * @param {CellProps} props Component props
 * @returns {React.JSX.Element}
 */
 function Cell({ rowIndex, colIndex }) {
    return (
      <div
        className={`polyboard-cell ${(rowIndex + colIndex) % 2 === 0 ? 'even' : 'odd'}`}
      >
      
      </div>
    );
  }


/**
 * The 5x11 Polysphere board component.
 * 
 * @typedef {object} PolyBoardProps
 * @property {number[][]} board The board array that is being displayed

 * 
 * @param {PolyBoardProps} props Component props
 * @returns {React.JSX.Element}
 */
function PolyBoard({ board }) {


  return (
    <div
      className="polyboard-grid"
      style={{ gridTemplateColumns: `repeat(11, 40px)` }} // Fixed 11 columns
    >
        {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            rowIndex={rowIndex}
            colIndex={colIndex}
          />
        ))
      )}
    </div>
  );
}

export default PolyBoard;
