import "./QueenBoard.css";
import QueenCell from "../QueenCell/QueenCell";

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
        row.map((cell, colIndex) => (
          <QueenCell
            key={`${rowIndex}-${colIndex}`}
            isEven={(rowIndex + colIndex) % 2 === 0}
            isQueen={cell === 1}
            onMouseClick={() => {
              handleMouseClickCell(rowIndex, colIndex);
            }}
          />
        ))
      )}
    </div>
  );
}

export default QueenBoard;
