import { useState, useEffect } from "react";
import createPolysphereWorker from "../workers/createPolysphereWorker";
import pieces from "../lib/pieces";
import {
  flipShapeHorizontal,
  normaliseShape,
  rotateShapeCCW,
  createBoard2D,
} from "../lib/utils";

function usePolyspherePuzzle() {
  const [board, setBoard] = useState(createBoard2D(11, 5, ""));
  const [shapes, setShapes] = useState(pieces);
  const [selectedShape, setSelectedShape] = useState(shapes[0]);

  const [isSolving, setIsSolving] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  const [worker, setWorker] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [solutionIndex, setSolutionIndex] = useState(0);

  const [moveStack, setMoveStack] = useState([]);

  const [highlightedIndex, setHighlightedIndex] = useState([0, 0]);
  const [highlightedCells, setHighlightedCells] = useState([]);

  // Start a background worker (much like a thread) with the polysphere solver,
  // since it takes a long time to run and will otherwise freeze the React app.
  useEffect(() => {
    try {
      const newWorker = createPolysphereWorker();
      setWorker(newWorker);
      // Cleanup worker
      return () => {
        newWorker.terminate();
      };
    } catch (err) {
      console.error("Failed to create Web Worker:", err);
    }
  }, []);

  // Update board when solution changes
  useEffect(() => {
    if (solutions[solutionIndex]) {
      setBoard(solutions[solutionIndex]);
    }
  }, [solutions, solutionIndex]);

  useEffect(() => {
    if (selectedShape && highlightedIndex) {
      const highlightedCells = selectedShape.coords.map(([x, y]) => [
        x + highlightedIndex[1],
        y + highlightedIndex[0],
      ]);
      // Check if this highlighted shape is within the boards boundaries
      const isInBounds = highlightedCells.every(
        ([x, y]) => x < board[0].length && y < board.length
      );
      // Only highlight if within bounds
      if (isInBounds) {
        setHighlightedCells(highlightedCells);
      } else {
        setHighlightedCells([]);
      }
    }
  }, [selectedShape, board, highlightedIndex]);

  /**
   * Handle clicking the solve button. Starts the puzzle solver using a
   * background worker. Updates the solutions array as the worker finds new
   * solutions.
   */
  const handleSolve = () => {
    if (!worker) return;
    if (isSolving) return;
    // Handler for when the worker sends a solution back here
    const messageHandler = (e) => {
      if (e.data.type === "solution") {
        setSolutions((prev) => [...prev, e.data.data]);
      }
      if (e.data.type === "complete") {
        setIsSolved(true);
        setIsSolving(false);
        // Remove 'onMessage' handler when worker is complete
        worker.removeEventListener("message", messageHandler);
      }
    };
    setIsSolving(true);
    // Attach 'onMessage' event listener
    worker.addEventListener("message", messageHandler);
    // Send the current board configuration and pieces to the solver
    worker.postMessage({ board, pieces });
  };

  /**
   * Handle clicking the clear button. Resets the board and game state.
   */
  const handleClear = () => {
    if (!isSolving) {
      setBoard(createBoard2D(11, 5, ""));
      setShapes(pieces);
      setSelectedShape(pieces[0]);
      setSolutions([]);
      setSolutionIndex(0);
      setIsSolved(false);
      setIsSolving(false);
      setMoveStack([]);
    }
  };

  /**
   * Handle setting the solution index.
   *
   * @param {number} index The index of the solution to display.
   */
  const handleSetSolutionIndex = (index) => {
    if (0 <= solutionIndex && solutionIndex < solutions.length) {
      setSolutionIndex(index);
      setBoard(solutions[index]);
    }
  };

  /**
   * Handle clicking the undo button. Reverts the board to the previous move
   * and restores the piece.
   */
  const handleUndo = () => {
    if (moveStack.length > 0 && !isSolving) {
      setMoveStack((prev) => {
        const newStack = [...prev];
        const lastMove = newStack.pop();
        // Restore the board to the previous state
        setBoard(lastMove.board);
        // Restore the piece to availabe pieces
        if (lastMove.piece) {
          setShapes((prev) => [...prev, lastMove.piece]);
          setSelectedShape(lastMove.piece);
        }
        return newStack;
      });
    }
  };

  /**
   * Adds a move to the move stack, enabling undo functionality.
   *
   * @param {Array<Array<string>>} board The current board state.
   * @param {Object} piece The current piece being placed.
   */
  const addMove = (board, piece) => {
    setMoveStack((prev) => [...prev, { board, piece }]);
  };

  /**
   * Handles mouse entering a cell. Highlights potential placement of current
   * selected shape.
   *
   * @param {number} row The row index of the cell.
   * @param {number} col The column index of the cell.
   */
  const handleMouseEnterCell = (row, col) => {
    if (isSolving || !selectedShape) return;
    // Highlight the current shape where the mouse is on the board
    setHighlightedIndex([row, col]);
  };

  /**
   * Handles the mouse leaving a cell. The array of highlighted cells is
   * cleared.
   *
   * @param {number} row The row index of the cell.
   * @param {number} col The column index of the cell.
   */
  const handleMouseLeaveCell = (row, col) => {
    if (isSolving) return;
    // Un-highlight all cells when no longer hovering over a cell
    setHighlightedIndex(null);
  };

  /**
   * Handles the mouse clicking a cell. Will attempt to place the current
   * shape.
   *
   * @param {number} row The row index of the cell.
   * @param {number} col The column index of the cell.
   */
  const handleMouseClickCell = (row, col) => {
    // Check that there is space for placing this shape
    const isEmpty = highlightedCells.every(([x, y]) => board[y][x] === "");
    // Check the shape fits within the board
    const isInBounds =
      highlightedCells.every(
        ([x, y]) => x < board[0].length && y < board.length
      ) && highlightedCells.length > 0;
    // Don't place cell if there is no space, or the space is not within the
    // screen bounds, or if the solver is already working
    if (!isEmpty || !isInBounds || isSolving) return;

    // Then place the piece...
    // 1. Add this move to the 'undo' stack
    addMove([...board.map((row) => [...row])], selectedShape);
    // 2. Place this piece on the board
    setBoard(
      board.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          highlightedCells.some(([x, y]) => x === colIndex && y === rowIndex)
            ? selectedShape.symbol
            : cell
        )
      )
    );
    // 3. Remove this piece from our 'inventory' so we can't place it again
    setShapes((prevShapes) => {
      const newShapes = prevShapes.filter(
        (shape) => shape.symbol !== selectedShape.symbol
      );
      setSelectedShape(newShapes[0] || null);
      return newShapes;
    });
  };

  /**
   * Selects the previous shape in the shapes array. Wraps to the end of the
   * list if the current shape is the first element.
   */
  const handlePreviousShape = () => {
    if (shapes.length > 0) {
      const currentIndex = shapes.findIndex(
        (shape) => shape.symbol === selectedShape.symbol
      );
      const newIndex = (currentIndex - 1 + shapes.length) % shapes.length;
      setSelectedShape(shapes[newIndex]);
    }
  };

  /**
   * Selects the next shape in the shapes array. Wraps to the start of the list
   * if the current shape is the last element.
   */
  const handleNextShape = () => {
    if (shapes.length > 0) {
      const currentIndex = shapes.findIndex(
        (shape) => shape.symbol === selectedShape.symbol
      );
      const newIndex = (currentIndex + 1) % shapes.length;
      setSelectedShape(shapes[newIndex]);
    }
  };

  /**
   * Rotates the selected shape 90 degrees clockwise and updates the selected
   * shape's coordinates with the normalized rotated version.
   */
  const handleRotateShape = () => {
    if (selectedShape) {
      const newShape = { ...selectedShape };
      newShape.coords = normaliseShape(rotateShapeCCW(newShape.coords));
      setSelectedShape(newShape);
    }
  };

  /**
   * Flips the selected shape horizontally and updates the selected shape's
   * coordinates with the normalized flipped version.
   */
  const handleFlipShape = () => {
    if (selectedShape) {
      const newShape = { ...selectedShape };
      newShape.coords = normaliseShape(flipShapeHorizontal(newShape.coords));
      setSelectedShape(newShape);
    }
  };

  return {
    board,
    shapes,
    selectedShape,
    highlightedCells,
    moveStack,
    isSolved,
    isSolving,
    solutions,
    solutionIndex,
    handleSolve,
    handleClear,
    handleSetSolutionIndex,
    handleUndo,
    handleMouseEnterCell,
    handleMouseLeaveCell,
    handleMouseClickCell,
    handlePreviousShape,
    handleNextShape,
    handleRotateShape,
    handleFlipShape,
  };
}

export default usePolyspherePuzzle;
