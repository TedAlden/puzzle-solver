import "./PolysphereBoard.css";

/**
 * A component that displays a grid board for placing polysphere shapes. Allows
 * users to place shapes on the board by clicking on a cell. Potential
 * placements are highlighted on the board as the user hovers on different
 * cells.
 *
 * @param {Object} props Component properties.
 * @param {string[][]} props.board A 2D array representing the polysphere board.
 * @param {number[][]} props.highlightedCells A list of cells to highlight.
 * @param {function} props.handleMouseEnterCell A callback for when the mouse
 *  enters a cell.
 * @param {function} props.handleMouseLeaveCell A callback for when the mouse
 * leaves a cell.
 * @param {function} props.handleMouseClickCell A callback for when the mouse
 * clicks on a cell.
 *
 * @returns {React.JSX.Element}
 */
function PolysphereBoard({
  board,
  highlightedCells,
  handleMouseEnterCell,
  handleMouseLeaveCell,
  handleMouseClickCell,
}) {
  return (
    <div className="polyboard-grid">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isHighlighted = highlightedCells.some(
            ([x, y]) => x === colIndex && y === rowIndex
          );
          return (
            <div
              role="cell"
              data-testid="cell"
              key={`${rowIndex}-${colIndex}`}
              onMouseEnter={() => handleMouseEnterCell(rowIndex, colIndex)}
              onMouseLeave={() => handleMouseLeaveCell(rowIndex, colIndex)}
              onClick={() => handleMouseClickCell(rowIndex, colIndex)}
              className={`polyboard-cell ${
                isHighlighted ? "highlighted" : ""
              } ${cell}`}
            ></div>
          );
        })
      )}
    </div>
  );
}

export default PolysphereBoard;
