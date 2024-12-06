/**
 * Buttons to save the current board as a JSON or CSV file.
 *
 * @param {Object} props Component properties.
 * @param {Array<Array<string>>} props.board The current board state.
 * @returns {React.JSX.Element}
 */
const BoardSave = ({ board }) => {
  /**
   * Exports the current board as a JSON file.
   */
  const handleExportAsJSON = () => {
    const placedPieces = board
      .flatMap((layer, layerIndex) =>
        layer.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => {
            if (cell) {
              return {
                piece: cell,
                position: {
                  layer: layerIndex,
                  row: rowIndex,
                  column: colIndex,
                },
              };
            }
            return null;
          })
        )
      )
      .filter(Boolean);

    const boardState = { board, placedPieces };
    const jsonBlob = new Blob([JSON.stringify(boardState, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(jsonBlob);
    link.download = "pyramid_board.json";
    link.click();
  };

  /**
   * Exports the current board as a CSV file with the following format:
   * ```
   * (Layer, Row, Column, Piece)
   * ```
   */
  const handleExportAsCSV = () => {
    const header = "Layer,Row,Column,Piece\n";
    const rows = board.flatMap((layer, layerIndex) =>
      layer.flatMap((row, rowIndex) =>
        row.map(
          (cell, colIndex) =>
            `${layerIndex},${rowIndex},${colIndex},${cell || ""}`
        )
      )
    );
    const csvContent = header + rows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "pyramid_board.csv";
    link.click();
  };

  return (
    <div className="saveAction">
      <button data-testid="export-json" onClick={handleExportAsJSON}>
        Export JSON
      </button>
      <button data-testid="export-csv" onClick={handleExportAsCSV}>
        Export CSV
      </button>
    </div>
  );
};

export default BoardSave;
