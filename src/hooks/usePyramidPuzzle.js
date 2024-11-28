/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import createPyramidWorker from "../workers/createPyramidWorker";
import pieces from "../lib/pieces";
import {
  createBoardPyramid,
  normaliseShape3D,
  rotateShapeX,
  rotateShapeY,
  rotateShapeZ,
  flipShapeX,
  flipShapeY,
  flipShapeZ,
} from "../lib/utils";

function usePyramidPuzzle() {
  const [board, setBoard] = useState(createBoardPyramid(5, ""));
  //const [shapes, setShapes] = useState(pieces);
  const [shapes, setShapes] = useState(
    pieces.map((piece) => ({
      ...piece,
      coords: piece.coords.map(([x, z]) => [x, 0, z]),
    }))
  );
  const [selectedShape, setSelectedShape] = useState(shapes[0]);
  const [highlightedIndex, setHighlightedIndex] = useState([-1, -1, -1]);
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

  useEffect(() => {
    if (highlightedIndex.some((i) => i === -1)) {
      setHighlightedCells([]);
      return;
    }
    const highlightedCells = selectedShape.coords.map(([x, y, z]) => [
      x + highlightedIndex[2], // col
      highlightedIndex[0], // layer
      z + highlightedIndex[1], // row
    ]);
    const isInBounds = highlightedCells.every(
      ([x, y, z]) =>
        y >= 0 &&
        y < board.length &&
        x >= 0 &&
        x < board[y].length &&
        z >= 0 &&
        z < board[y][x].length
    );
    if (isInBounds) {
      setHighlightedCells(highlightedCells);
    } else {
      setHighlightedCells([]);
    }
  }, [selectedShape, board, highlightedIndex]);

  const addMove = (board, piece) => {
    setMoveStack((prev) => [...prev, { board, piece }]);
  };

  const handleRotatePieceX = () => {
    if (!isSolving && selectedShape) {
      const newShape = { ...selectedShape };
      newShape.coords = normaliseShape3D(rotateShapeX(newShape.coords));
      setSelectedShape(newShape);
    }
  };

  const handleRotatePieceY = () => {
    if (!isSolving && selectedShape) {
      const newShape = { ...selectedShape };
      newShape.coords = normaliseShape3D(rotateShapeY(newShape.coords));
      setSelectedShape(newShape);
    }
  };

  const handleRotatePieceZ = () => {
    if (!isSolving && selectedShape) {
      const newShape = { ...selectedShape };
      newShape.coords = normaliseShape3D(rotateShapeZ(newShape.coords));
      setSelectedShape(newShape);
    }
  };

  const handleFlipPieceX = () => {
    if (!isSolving && selectedShape) {
      const newShape = { ...selectedShape };
      newShape.coords = normaliseShape3D(flipShapeX(newShape.coords));
      setSelectedShape(newShape);
    }
  };

  const handleFlipPieceY = () => {
    if (!isSolving && selectedShape) {
      const newShape = { ...selectedShape };
      newShape.coords = normaliseShape3D(flipShapeY(newShape.coords));
      setSelectedShape(newShape);
    }
  };

  const handleFlipPieceZ = () => {
    if (!isSolving && selectedShape) {
      const newShape = { ...selectedShape };
      newShape.coords = normaliseShape3D(flipShapeZ(newShape.coords));
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
    const pieces3D = pieces.map((piece) => ({
      ...piece,
      coords: piece.coords.map(([x, z]) => [x, 0, z]),
    }));

    worker.postMessage({ board, pieces: pieces3D });
  };

  const handleMouseEnterCell = (layer, row, col) => {
    setHighlightedIndex([layer, row, col]);
  };

  const handleMouseLeaveCell = () => {
    setHighlightedIndex([-1, -1, -1]);
  };

  const handleMouseClickCell = (layer, row, col) => {
    if (!selectedShape) return;
    const highlightedCells =
      selectedShape?.coords.map(([x, y, z]) => [x + col, y + layer, z + row]) ||
      [];
    const isInBounds = highlightedCells.every(
      ([x, y, z]) =>
        y >= 0 &&
        y < board.length &&
        x >= 0 &&
        x < board[y].length &&
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
    handleRotatePieceX,
    handleRotatePieceY,
    handleRotatePieceZ,
    handleFlipPieceX,
    handleFlipPieceY,
    handleFlipPieceZ,
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
