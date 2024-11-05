import './PolyBoard.css';
import { useEffect, useState } from 'react';
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
  const [mouseHoverCell, setMouseHoverCell] = useState([]);

  /**
   * Handles mouse entering a cell. Stores the row and col in the components
   * state, so that change in the row/col can update the piece highlighting.
   *
   * @param {number} row The row index of the cell.
   * @param {number} col The column index of the cell.
   */
  const handleMouseEnterCell = (row, col) => {
    setMouseHoverCell([row, col]);
  }

  /**
   * Handles the mouse leaving a cell. The array of highlighted cells is
   * cleared.
   * 
   * @param {number} row The row index of the cell.
   * @param {number} col The column index of the cell.
   */
  const handleMouseLeaveCell = (row, col) => {
    // Un-highlight all cells when no longer hovering over a cell
    setMouseHoverCell([]);
    setHighlightedCells([]);
  }

  /**
   * Update the highlighted shape on the board. This happens when the mouse
   * hovers over a new cell, or if the selected shape changes.
   * 
   * Since keyboard controls were added, the selected shape may change without
   * the mouseHoverCell changing.
   */
  useEffect(() => {
    const [row, col] = mouseHoverCell;
    if (isSolving || !selectedShape || !(row && col)) return;
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
  }, [mouseHoverCell, selectedShape])

  /**
   * Handles the mouse clicking a cell. Will attempt to place the current
   * shape.
   * 
   * @param {number} row The row index of the cell.
   * @param {number} col The column index of the cell.
   */
  const handleMouseClickCell = (row, col) => {
    // Check that there is space for placing this shape
    const isEmpty = highlightedCells.every(
      ([x, y]) => board[y][x] === ""
    );
    // Check the shape fits within the board
    const isInBounds = highlightedCells.every(
      ([x, y]) => x < board[0].length && y < board.length
    ) && highlightedCells.length > 0;
    // Don't place cell if there is no space, or the space is not within the 
    // screen bounds, or if the solver is already working
    if (!isEmpty || !isInBounds || isSolving) return;

    // Then place the piece...
    // 1. Add this move to the 'undo' stack
    addMove([...board.map(row => [...row])], selectedShape);
    // 2. Place this piece on the board
    setBoard(board.map((row, rowIndex) =>
      row.map((cell, colIndex) =>
        highlightedCells.some(([x, y]) => x === colIndex && y === rowIndex)
          ? selectedShape.symbol
          : cell
      )
    ));
    // 3. Remove this piece from our 'inventory' so we can't place it again
    setShapes(prevShapes => {
      const newShapes = prevShapes.filter(
        shape => shape.symbol !== selectedShape.symbol
      );
      setSelectedShape(newShapes[0] || null);
      return newShapes;
    });
  }

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
