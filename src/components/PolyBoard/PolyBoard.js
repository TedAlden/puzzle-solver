import './PolyBoard.css';
import { useState } from 'react';

function Cell({
  onMouseEnter,
  onMouseLeave,
  onMouseClick,
  highlighted,
  value
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onMouseClick}
      className={`polyboard-cell ${highlighted > 0 ? 'highlighted' : ''} ${value}`}
    >
    </div>
  );
}

function PolyBoard({
  board,
  setBoard,
  selectedShape,
  setSelectedShape,
  shapes,
  setShapes
}) {
  const [highlightedCells, setHighlightedCells] = useState([]);

  const handleMouseEnterCell = (row, col) => {
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



  // FIXME: add handler if all shapes are placed to prevent crash



  const handleMouseLeaveCell = (row, col) => {
    // Un-highlight all cells when no longer hovering over a cell
    setHighlightedCells([]);
  }

  const handleMouseClickCell = (row, col) => {
    // Check that there is space for placing this shape
    const isEmpty = highlightedCells.every(
      ([x, y]) => board[y][x] === ""
    );
    // Check the shape fits within the board
    const isInBounds = highlightedCells.every(
      ([x, y]) => x < board[0].length && y < board.length
    ) && highlightedCells.length > 0;
    // Then place
    if (isEmpty && isInBounds) {
      // Place this piece on the board
      setBoard(board.map((row, rowIndex) =>
        row.map((cell, colIndex) => 
          highlightedCells.some(([x, y]) => x === colIndex && y === rowIndex) 
            ? selectedShape.symbol 
            : cell
        )
      ));
      // Remove this piece from our 'inventory' so we can't place it again
      const index = shapes.indexOf(selectedShape);
      const newShapes = [...shapes];
      newShapes.splice(index, 1);
      setShapes(newShapes);
      setSelectedShape(newShapes[0] || null);
    }
  }

  return (
    <div className="polyboard-grid">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            highlighted={highlightedCells.some(([x, y]) => x === colIndex && y === rowIndex)}
            value={board[rowIndex][colIndex]}
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
