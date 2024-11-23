import "./PyramidLayerBoards.css";

/**
 * A component that displays 2D grid representations of each layer in the pyramid.
 * Shows all placed pieces.
 * Each layer's grid size matches its position in the pyramid:
 * Layer 1 (top): 1x1
 * Layer 2: 2x2
 * Layer 3: 3x3
 * Layer 4: 4x4
 * Layer 5 (base): 5x5
 *
 * @param {Object} props Component properties.
 * @param {Array<Array<Array<string>>>} props.board The 3D pyramid board state.
 * @param {Array<Array<number>>} props.highlightedCells Array of coordinates for
 *  cells to highlight.
 * @param {Object} props.selectedShape The currently selected shape object.
 * @returns {JSX.Element}
 */
function PyramidLayerBoards({
  board,
  setBoard,
  highlightedCells,
  setHighlightedCells,
  selectedShape,
  setSelectedShape,
  setShapes,
}) {
  const handleMouseEnterCell = (layer, row, col) => {
    const highlightedCells = selectedShape.coords.map(([x, z]) => [
      x + col,
      0 + layer,
      z + row,
    ]);
    const isInBounds = highlightedCells.every(
      ([x, y, z]) =>
        x >= 0 &&
        x < board[y].length &&
        y >= 0 &&
        y < board.length &&
        z >= 0 &&
        z < board[y][x].length
    );
    if (isInBounds) {
      setHighlightedCells(highlightedCells);
    }
  };

  const handleMouseLeaveCell = (layer, row, col) => {
    setHighlightedCells([]);
  };

  const handleMouseClickCell = (layer, row, col) => {
    const isSpaceOccupied = highlightedCells.some(
      ([dx, dy, dz]) => board[dy][dx][dz] !== ""
    );
    // If there is space, then:
    if (!isSpaceOccupied) {
      // 1. place the shape on the pyramid board
      setBoard(
        board.map((layer, i) =>
          layer.map((row, j) =>
            row.map((cell, k) =>
              highlightedCells.some(
                ([dx, dy, dz]) => dy === i && dx === j && dz === k
              )
                ? selectedShape.symbol
                : cell
            )
          )
        )
      );
      // 2. remove the shape from our inventory of available shapes
      setShapes((prevShapes) => {
        const newShapes = prevShapes.filter(
          (shape) => shape.symbol !== selectedShape.symbol
        );
        setSelectedShape(newShapes[0] || null);
        return newShapes;
      });
    }
  };

  /**
   * Renders a single layer of the pyramid.
   *
   * @param {number} layerIndex The index of the layer to render (0-4)
   * @returns {JSX.Element}
   */
  const renderLayer = (layerIndex) => {
    const layerSize = board.length - layerIndex;
    const layer = board[layerIndex];

    return (
      <div key={layerIndex} className="layer-section">
        <div className="layer-label">Layer {layerSize}</div>
        <div
          className="layer-grid"
          style={{
            gridTemplateColumns: `repeat(${layerSize}, 1fr)`,
            width: `${layerSize * 40}px`,
          }}
        >
          {layer.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              // Check if this cell is part of the preview (highlighted)
              const isHighlighted = highlightedCells.some(
                ([x, y, z]) =>
                  x === colIndex && y === layerIndex && z === rowIndex
              );

              // Determine the cell's class based on its state
              const cellClass = `polyboard-cell ${
                isHighlighted ? "highlighted" : ""
              } ${layer[colIndex][rowIndex] || ""}`;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cellClass}
                  onMouseEnter={() =>
                    handleMouseEnterCell(layerIndex, rowIndex, colIndex)
                  }
                  onMouseLeave={() =>
                    handleMouseLeaveCell(layerIndex, rowIndex, colIndex)
                  }
                  onClick={() =>
                    handleMouseClickCell(layerIndex, rowIndex, colIndex)
                  }
                />
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="layer-boards-container">
      <div className="layer-title">Layer Views</div>
      {/* Render layers from bottom to top */}
      {Array.from({ length: board.length })
        .map((_, i) => board.length - i - 1)
        .map((layerIndex) => renderLayer(layerIndex))}
    </div>
  );
}

export default PyramidLayerBoards;
