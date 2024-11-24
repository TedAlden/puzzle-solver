import "./QueenBoard.css";

/**
 * A grid board containing toggleable cells for placing/removing queens. Each
 * cell can hold a queen.
 *
 * @param {Object} props Component properties.
 * @param {number[][]} props.board A 2D array representing the board state.
 * @param {function} props.handleMouseClickCell Called when a cell is clicked.
 * @returns {React.JSX.Element}
 */
function QueenBoard({ board, handleMouseClickCell }) {
  return (
    <div
      role="grid"
      className="board-grid"
      style={{ gridTemplateColumns: `repeat(${board.length}, 50px)` }}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isQueen = cell === 1;
          const isEven = (rowIndex + colIndex) % 2 === 0;
          return (
            <div
              role="cell"
              key={`${rowIndex}-${colIndex}`}
              className={`board-cell ${isEven ? "even" : "odd"}`}
              onClick={() => handleMouseClickCell(rowIndex, colIndex)}
            >
              {isQueen && <span className="board-queen">♛</span>}
            </div>
          );
        })
      )}
    </div>
  );
}

export default QueenBoard;
