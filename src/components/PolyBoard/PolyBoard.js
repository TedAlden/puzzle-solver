import './PolyBoard.css';

/**
 * An individual cell of the polysphere board.
 * @param {object} props Component props
 * @param {number} props.rowIndex The row index of the cell
 * @param {number} props.colIndex The column index of the cell
 * @returns {React.JSX.Element}
 */
function Cell({ rowIndex, colIndex }) {
  return (
    <div
      className="polyboard-cell"
    >
    </div>
  );
}

/**
 * The 5x11 Polysphere board.
 * @param {object} props Component props
 * @param {number} props.board The 5x11 puzzle board
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
