import "./NQueenPuzzle.css";
import QueenBoard from "../../components/QueenBoard/QueenBoard";
import KeyboardControls from "../../components/KeyboardControls/KeyboardControls";
import useNQueenPuzzle from "../../hooks/useNQueenPuzzle";

/**
 * A component displaying the N-Queens puzzle solver, including the board and
 * all of the input controls.
 *
 * @returns {React.JSX.Element}
 */
function NQueenPuzzle() {
  const {
    board,
    isSolved,
    boardSize,
    handleSolve,
    handleClear,
    handleResizeBoard,
    handleMouseClickCell,
  } = useNQueenPuzzle();

  const keyMap = [
    {
      key: "Escape",
      keyAlias: "Esc",
      description: "Clear board",
      onClick: handleClear,
    },
    {
      key: "s",
      keyAlias: "S",
      description: "Solve puzzle",
      onClick: handleSolve,
    },
    {
      key: "ArrowUp",
      keyAlias: "↑",
      description: "Increase board size",
      onClick: () => {
        const newSize = Math.max(1, boardSize + 1);
        handleResizeBoard(newSize);
      },
    },
    {
      key: "ArrowDown",
      keyAlias: "↓",
      description: "Decrease board size",
      onClick: () => {
        const newSize = Math.max(1, boardSize - 1);
        handleResizeBoard(newSize);
      },
    },
  ];

  return (
    <div className="puzzleOne">
      <h2>The N-Queens Puzzle</h2>
      <div className="wrapper">
        <div className="column leftColumn">
          <div className="input-section">
            <label htmlFor="board-size">Board Size:</label>
            <input
              type="number"
              id="board-size"
              value={boardSize}
              onChange={(e) => {
                const newSize = Math.max(1, parseInt(e.target.value) || 0);
                handleResizeBoard(newSize);
              }}
              min={1}
            />
          </div>
          <QueenBoard
            board={board}
            handleMouseClickCell={handleMouseClickCell}
          />
          <div className="controlsContainer">
            <button onClick={handleSolve}>Solve</button>
            <button onClick={handleClear}>Clear</button>
          </div>
          <div className="solutionsText">
            {isSolved && <span>Solution found</span>}
          </div>
        </div>
        <div className="column rightColumn">
          <p className="description">
            The <b> N-Queens Problem </b> is a puzzle that involves placing
            <b> N </b> queens on an <b> N x N </b> chessboard in such a way that
            no two queens can attack each other - meaning no two queens share
            the same row, column, or diagonal. In this app, you can place some
            of the queens manually, and the algorithm will attempt to solve the
            rest of the puzzle for you. Simply place your queens, click the
            <b> Solve </b> button, and the algorithm will find the remaining
            valid positions for the queens.
          </p>
          <KeyboardControls keyMap={keyMap} />
        </div>
      </div>
    </div>
  );
}

export default NQueenPuzzle;
