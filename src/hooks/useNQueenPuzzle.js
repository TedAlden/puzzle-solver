import { useState } from "react";
import { createBoard2D } from "../lib/utils";
import { solveNQueens } from "../lib/nqueens";

function useNQueenPuzzle() {
  const [boardSize, setBoardSize] = useState(4);
  const [board, setBoard] = useState(createBoard2D(boardSize, boardSize, 0));
  const [isSolved, setIsSolved] = useState(false);

  /**
   * Attempts to solve the N-Queens problem using the board.
   */
  const handleSolve = () => {
    // Create a copy of the chess board and attempt to solve
    const newBoard = [...board];
    const solved = solveNQueens(newBoard);
    setIsSolved(solved);
    if (solved) {
      // Show completed board if successful
      setBoard(newBoard);
    } else {
      alert("No possible Solutions found");
    }
  };

  /**
   * Clears the board and resets the solved status to false.
   */
  const handleClear = () => {
    setBoard(createBoard2D(boardSize, boardSize, 0));
    setIsSolved(false);
  };

  /**
   * Resizes the board to a given new size and clears it.
   *
   * @param {number} newSize The new size of the board.
   */
  const handleResizeBoard = (newSize) => {
    setBoardSize(newSize);
    setBoard(createBoard2D(newSize, newSize, 0));
    setIsSolved(false);
  };

  /**
   * Handles a mouse click on a cell in the board. Toggles the placement of a
   * queen in that cell.
   *
   * @param {number} row The row index of the cell.
   * @param {number} col The column index of the cell.
   */
  const handleMouseClickCell = (row, col) => {
    const newValue = board[row][col] === 1 ? 0 : 1;
    setBoard(
      board.map((r, i) =>
        i === row ? r.map((c, j) => (j === col ? newValue : c)) : r
      )
    );
  };

  return {
    board,
    isSolved,
    boardSize,
    handleSolve,
    handleClear,
    handleResizeBoard,
    handleMouseClickCell,
  };
}

export default useNQueenPuzzle;
