/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import createPyramidWorker from "../workers/createPyramidWorker";
import solveRecursive from "../lib/pyramidPuzzleSolver";
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
import {
  findEmptyPosition,
  getAllOrientations,
  findAnchorPoints,
  canPlacePiece,
  placePiece,
} from "../lib/solverUtils";

// Convert pieces to 3D (having a y coordinate)
const pieces3D = Array.from(
  pieces.map((piece) => {
    const coords = piece.coords.map(([x, z]) => [x, 0, z]);
    return { ...piece, coords };
  })
);

function usePyramidPuzzle() {
  const [board, setBoard] = useState(createBoardPyramid(5, ""));
  const [shapes, setShapes] = useState(pieces3D);
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
    if (highlightedIndex.some((i) => i === -1) || !selectedShape) { 
      setHighlightedCells([]);
      return;
    }
    const highlightedCells = selectedShape.coords.map(([x, y, z]) => [
      x + highlightedIndex[2],
      y + highlightedIndex[0],
      z + highlightedIndex[1],
    ]);
    const isInBounds = highlightedCells.every(([x, y, z]) => {
      if (y < 0 || y >= board.length) {
        return false;
      }
      if (x < 0 || x >= board[y].length) {
        return false;
      }
      if (z < 0 || z >= board[y][x].length) {
        return false;
      }
      return true;
    });
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
      setShapes(pieces3D);
      setSelectedShape(shapes[0]);
      setSolutions([]);
      setIsSolving(false);
      setSolutionIndex(0);
      setIsSolved(false);
      setMoveStack([]);
    }
  };

  /**
   * Handle setting the solution index.
   *
   * @param {number} index The index of the solution to display.
   */
  const handleSetSolutionIndex = (index) => {
    if (0 <= index && index < solutions.length) {  
      setSolutionIndex(index);
      setBoard(solutions[index]);
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

    // Identify which pieces have already been placed based on the board state
    const placedSymbols = new Set(
      board.flat(2).filter((cell) => cell !== "") // Collect all non-empty cells
    );

    const remainingPieces = shapes.filter(
      (piece) => !placedSymbols.has(piece.symbol)
    );

    //console.log("Placed pieces:", Array.from(placedSymbols));
    //console.log("Remaining pieces after filtering:", remainingPieces);

    // Handler for when the worker sends a solution back here
    const messageHandler = (e) => {
      if (e.data.type === "solution") {
        console.log("Found solution:", e.data.data);
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
    const pieces3D = remainingPieces.map((piece) => ({
      ...piece,
      coords: piece.coords.map(([x, y, z]) => [x, y, z]), // Ensure 3D positions
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
    const isInBounds = highlightedCells.every(([x, y, z]) => {
      if (y < 0 || y >= board.length) {
        return false;
      }
      if (x < 0 || x >= board[y].length) {
        return false;
      }
      if (z < 0 || z >= board[y][x].length) {
        return false;
      }
      return true;
    });
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

  const handleChallengeMode = () => {
    console.log("Challenge Mode Started");
  
    const maxPieces = Math.floor(Math.random() * 3) + 1; // Randomly place 1–3 pieces
    const remainingPieces = shapes.filter(
      (piece) => !board.flat(2).includes(piece.symbol)
    );
  
    // Initialise variables
    let updatedBoard = board.map((layer) => layer.map((row) => [...row])); // Deep copy of the board
    const placedPieces = []; // Array to track placed pieces
  
    // Recursive function to place pieces
    const placePieceRecursive = (board, unusedPieces, placedPiecesCount = 0) => {
      if (placedPiecesCount >= maxPieces || unusedPieces.length === 0) {
        return;
      }
  
      const emptyPos = findEmptyPosition(board);
      if (!emptyPos) return;
  
      const [startLayer, startRow, startCol] = emptyPos;
  
      for (let i = 0; i < unusedPieces.length; i++) {
        const piece = unusedPieces[i];
        const orientations = getAllOrientations(piece.coords);
  
        for (const orientation of orientations) {
          const anchorPoints = findAnchorPoints(orientation);
  
          for (const anchor of anchorPoints) {
            if (canPlacePiece(board, anchor, startLayer, startRow, startCol)) {
              const newBoard = placePiece(
                board,
                piece,
                anchor,
                startLayer,
                startRow,
                startCol
              );
  
              placedPieces.push({ piece, anchor });
              updatedBoard = newBoard; // Update the board state
  
              // Continue placing pieces
              const remainingPieces = [
                ...unusedPieces.slice(0, i),
                ...unusedPieces.slice(i + 1),
              ];
              placePieceRecursive(newBoard, remainingPieces, placedPiecesCount + 1);
  
              // Stop once we've placed enough pieces
              if (placedPieces.length >= maxPieces) {
                return;
              }
            }
          }
        }
      }
    };
  
    // Start placing pieces
    placePieceRecursive(updatedBoard, remainingPieces);
  
    // Update state after challenge mode setup
    setBoard(updatedBoard);
    setShapes(remainingPieces.filter((piece) => !placedPieces.some((p) => p.piece.symbol === piece.symbol)));
    console.log("Challenge Mode Completed:", placedPieces);
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
    handleSetSolutionIndex,
    handleMouseEnterCell,
    handleMouseLeaveCell,
    handleMouseClickCell,
    handleChallengeMode,
  };
}

export default usePyramidPuzzle;
