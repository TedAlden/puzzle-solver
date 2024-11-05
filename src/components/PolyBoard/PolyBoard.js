import './PolyBoard.css';
import { useState } from 'react';
import PolyCell from '../PolyCell/PolyCell';

/**
 * A component that displays a grid board for placing polysphere shapes. Allows
 * users to place shapes on the board by clicking on a cell. Potential
 * placements are highlighted on the board as the user hovers on different
 * cells.
 *
 * @param {Object} props Component properties.
 * @param {Array<Array<string>>} props.board A 2D array representing the board.
 * @param {function} props.setBoard Callback to update the board state.
 * @param {Object} props.selectedShape The currently selected shape object.
 * @param {function} props.setSelectedShape Callback to update the selected
 *  shape.
 * @param {Array<Object>} props.shapes Array of available shape objects.
 * @param {function} props.setShapes Callback to update the shapes array.
 * @param {boolean} props.isSolving Indicates if solver is currently working.
 *  If true, disables interaction with the board.
 * @param {function} props.addMove Callback to add the current move to the undo
 *  stack.
 * @returns {JSX.Element}
 */
function PolyBoard({
  board,
  setBoard,
  selectedShape,
  setSelectedShape,
  shapes,
  setShapes,
  isSolving,
  addMove
}) {
  const [highlightedCells, setHighlightedCells] = useState([]);

  const handleMouseEnterCell = (row, col) => {
    if (isSolving || !selectedShape)
      return;

    // Highlight the current shape where the mouse is on the board
    const highlightedCells = selectedShape.coords.map(
      ([x, y]) => [x + col, y + row]
    );
    // Check if this highlighted shape is within the boards boundaries
    const isInBounds = highlightedCells.every(
      ([x, y]) => x < board[0].length && y < board.length
    )
    // Only highlight if within bounds
    if (isInBounds) {
      setHighlightedCells(highlightedCells);
    }
  }

  /**
   * Handles the mouse leaving a cell. The array of highlighted cells is
   * cleared.
   */
  const handleMouseLeaveCell = (row, col) => {
    if (isSolving) return;
    // Un-highlight all cells when no longer hovering over a cell
    setHighlightedCells([]);
  }

  /**
   * Handles the mouse clicking a cell. Will attempt to place the current
   * shape.
   */
  const handleMouseClickCell = (row, col) => {
    // Don't place cell if solving in progress
    if (isSolving) return;
    // Check that there is space for placing this shape
    const isEmpty = highlightedCells.every(
      ([x, y]) => board[y][x] === ""
    );
    // Check the shape fits within the board
    const isInBounds = highlightedCells.every(
      ([x, y]) => x < board[0].length && y < board.length
    ) && highlightedCells.length > 0;
    // Then place the piece...
    if (isEmpty && isInBounds) {
      // Add this move to the 'undo' stack
      addMove([...board.map(row => [...row])], selectedShape);
      // Place this piece on the board
      setBoard(board.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          highlightedCells.some(([x, y]) => x === colIndex && y === rowIndex)
            ? selectedShape.symbol
            : cell
        )
      ));
      // Remove this piece from our 'inventory' so we can't place it again
      setShapes(prevShapes => {
        const newShapes = prevShapes.filter(
          shape => shape.symbol !== selectedShape.symbol
        );
        setSelectedShape(newShapes[0] || null);
        return newShapes;
      });
    }
  }

  return (
    <div className="polyboard-grid">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <PolyCell
            key={`${rowIndex}-${colIndex}`}
            highlighted={highlightedCells.some(([x, y]) => x === colIndex && y === rowIndex)}
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
