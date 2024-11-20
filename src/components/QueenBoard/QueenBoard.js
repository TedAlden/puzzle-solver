import "./QueenBoard.css";
import QueenCell from "../QueenCell/QueenCell";

/**
 * A grid board containing toggleable cells for placing/removing queens. Each
 * cell can hold a queen.
 *
 * @param {Object} props Component properties.
 * @param {number[][]} props.board A 2D array representing the board state.
 * @param {function} props.setBoard A function to update the board state.
 * @returns {React.JSX.Element}
 */
function QueenBoard({ board, setBoard }) {
  /**
   * Toggle the placement of a queen at a given cell (row, col).
   */
  const toggleQueen = (row, col) => {
    const newValue = board[row][col] === 1 ? 0 : 1;
    setBoard(
      board.map((r, i) =>
        i === row ? r.map((c, j) => (j === col ? newValue : c)) : r
      )
    );
  };

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
            onMouseClick={() => toggleQueen(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
}

export default QueenBoard;
