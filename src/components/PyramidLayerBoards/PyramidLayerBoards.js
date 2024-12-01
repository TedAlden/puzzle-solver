import "./PyramidLayerBoards.css";

/**
 * A component that displays 2D grid representations of each layer in the
 * pyramid. Shows all placed pieces.
 *
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
 * @returns {React.JSX.Element}
 */
function PyramidLayerBoards({
  board,
  highlightedCells,
  handleMouseEnterCell,
  handleMouseLeaveCell,
  handleMouseClickCell,
}) {
  return (
    <div className="layer-boards-container">
      {board
        .slice()
        .reverse()
        .map((layer, reversedIndex) => {
          const layerIndex = board.length - reversedIndex - 1;
          const layerSize = layer.length;
          return (
            // Draw each layer...
            <div key={layerIndex} className="layer-section">
              <div
                className="layer-grid"
                style={{
                  gridTemplateColumns: `repeat(${layerSize}, 1fr)`,
                  width: `${layerSize * 30}px`,
                }}
              >
                {layer.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    // Check if this cell is highlighted from being hovered over
                    const highlighted = highlightedCells.some(
                      ([x, y, z]) =>
                        x === colIndex && y === layerIndex && z === rowIndex
                    )
                      ? "highlighted"
                      : "";
                    // Get the value of the cell (the symbol of the shape piece
                    // i.e, "A", "B", "C", etc.) or an empty string if there is
                    // no piece
                    const value = layer[colIndex][rowIndex] || "";
                    // Construct the cell element
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`layer-cell ${highlighted} ${value}`}
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
        })}
    </div>
  );
}

export default PyramidLayerBoards;
