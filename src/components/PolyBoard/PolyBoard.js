import "./PolyBoard.css";
import PolyCell from "../PolyCell/PolyCell";

/**
 * A component that displays a grid board for placing polysphere shapes. Allows
 * users to place shapes on the board by clicking on a cell. Potential
 * placements are highlighted on the board as the user hovers on different
 * cells.
 *
 * @returns {JSX.Element}
 */
function PolyBoard({
  board,
  highlightedCells,
  handleMouseEnterCell,
  handleMouseLeaveCell,
  handleMouseClickCell,
}) {
  return (
    <div className="polyboard-grid">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <PolyCell
            key={`${rowIndex}-${colIndex}`}
            highlighted={highlightedCells.some(
              ([x, y]) => x === colIndex && y === rowIndex
            )}
            value={cell}
            onMouseEnter={() => handleMouseEnterCell(rowIndex, colIndex)}
            onMouseLeave={() => handleMouseLeaveCell(rowIndex, colIndex)}
            onMouseClick={() => handleMouseClickCell(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
}

export default PolyBoard;
