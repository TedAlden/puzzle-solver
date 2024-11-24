import { useState, useEffect } from "react";
import createPyramidWorker from "../workers/createPyramidWorker";
import pieces from "../lib/pieces";
import {
  flipShapeHorizontal,
  normaliseShape,
  rotateShapeCCW,
  createBoardPyramid,
} from "../lib/utils";

function usePyramidPuzzle() {
  const [board, setBoard] = useState(createBoardPyramid(5, ""));
  const [shapes, setShapes] = useState(pieces);
  const [selectedShape, setSelectedShape] = useState(shapes[0]);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [isSolving, setIsSolving] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [moveStack, setMoveStack] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [solutionIndex, setSolutionIndex] = useState(0);
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    try {
      const newWorker = createPyramidWorker();
      setWorker(newWorker);
      // Cleanup worker
      return () => {
        newWorker.terminate();
      };
    } catch (err) {
      console.error("Failed to create Pyramid Web Worker:", err);
    }
  }, []);

  // Update board when solution changes
  useEffect(() => {
    if (solutions[solutionIndex]) {
      setBoard(solutions[solutionIndex]);
    }
  }, [solutions, solutionIndex]);

  const addMove = (board, piece) => {
    setMoveStack((prev) => [...prev, { board, piece }]);
  };

  const handleRotatePiece = () => {
    if (!isSolving && selectedShape) {
      const newShape = { ...selectedShape };
      newShape.coords = normaliseShape(rotateShapeCCW(newShape.coords));
      setSelectedShape(newShape);
    }
  };

  const handleFlipPiece = () => {
    if (!isSolving && selectedShape) {
      const newShape = { ...selectedShape };
      newShape.coords = normaliseShape(flipShapeHorizontal(newShape.coords));
      setSelectedShape(newShape);
    }
  };

  const handlePreviousPiece = () => {
    if (!isSolving && shapes.length > 0) {
      const currentIndex = shapes.findIndex(
        (shape) => shape.symbol === selectedShape.symbol
      );
      const newIndex = (currentIndex - 1 + shapes.length) % shapes.length;
      setSelectedShape(shapes[newIndex]);
    }
  };

  const handleNextPiece = () => {
    if (!isSolving && shapes.length > 0) {
      const currentIndex = shapes.findIndex(
        (shape) => shape.symbol === selectedShape.symbol
      );
      const newIndex = (currentIndex + 1) % shapes.length;
      setSelectedShape(shapes[newIndex]);
    }
  };

  const handleClear = () => {
    if (!isSolving) {
      setBoard(createBoardPyramid(5, ""));
      setShapes(pieces);
      setSelectedShape(shapes[0]);
      setIsSolving(false);
      setMoveStack([]);
    }
  };

  const handleUndo = () => {
    if (!isSolving && moveStack.length > 0) {
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

  const handleSolve = () => {
    if (!worker) {
      console.error("Worker not initialized");
      return;
    }
    // Handler for when the worker sends a solution back here
    const messageHandler = (e) => {
      console.log("Worker message received:", e.data);
      if (e.data.type === "solution") {
        setSolutions((prev) => [...prev, e.data.data]);
      }
      if (e.data.type === "complete") {
        console.log("Solver completed");
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
    console.log("Sending board and pieces to worker:");
    console.log("Board:", board);
    console.log("Pieces:", shapes);
    worker.postMessage({ board, pieces });
  };

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
    const isUnoccupiedSpace = isInBounds
      ? !highlightedCells.some(([dx, dy, dz]) => board[dy][dx][dz] !== "")
      : false;
    // If there is space, and the shape is within the boards edge bounds then:
    if (isUnoccupiedSpace && isInBounds) {
      // 1. add the move to the move stack
      addMove([...board.map((row) => [...row])], selectedShape);
      // 2. place the shape on the pyramid board
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
      // 3. remove the shape from our inventory of available shapes
      setShapes((prevShapes) => {
        const newShapes = prevShapes.filter(
          (shape) => shape.symbol !== selectedShape.symbol
        );
        setSelectedShape(newShapes[0] || null);
        return newShapes;
      });
    }
  };

  return {
    board,
    highlightedCells,
    selectedShape,
    shapes,
    handleRotatePiece,
    handleFlipPiece,
    handleNextPiece,
    handlePreviousPiece,
    handleClear,
    handleUndo,
    handleSolve,
    handleMouseEnterCell,
    handleMouseLeaveCell,
    handleMouseClickCell,
  };
}

export default usePyramidPuzzle;
