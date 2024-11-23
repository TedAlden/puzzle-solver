import "./PyramidPuzzle.css";
import { useState } from "react";
import ProgressBar from "../../components/Shared/ProgressBar/ProgressBar";
import PieceSelector from "../../components/Shared/PieceSelector/PieceSelector";
import pieces from "../../lib/pieces";
import PyramidBoard from "../../components/PyramidBoard/PyramidBoard";
import PyramidLayerBoards from "../../components/PyramidLayerBoards/PyramidLayerBoards";
import KeyboardControls from "../../components/Shared/KeyboardControls/KeyboardControls";
import {
  flipShapeHorizontal,
  normaliseShape,
  rotateShapeCCW,
} from "../../lib/utils";

// TODO: add x,y,z guide lines

/**
 * Creates a 3D pyramid puzzle with a given size.
 *
 * @param {number} size The size of the pyramid.
 * @returns {Array<Array<Array<number>>>} A 3D array representing the pyramid.
 */
const createPyramid = (size) =>
  Array.from({ length: size }, (_, i) =>
    Array.from({ length: size - i }, () => Array(size - i).fill(""))
  );

function PyramidPuzzle() {
  const [board, setBoard] = useState(createPyramid(5));
  const [shapes, setShapes] = useState(pieces);
  const [selectedShape, setSelectedShape] = useState(shapes[0]);
  const [highlightedCells, setHighlightedCells] = useState([]);
  const [isSolving, setIsSolving] = useState(false);

  const handleClear = () => {
    setBoard(createPyramid(5));
    setShapes(pieces);
    setSelectedShape(shapes[0]);
    setIsSolving(false);
  };

  return (
    <div className="puzzleThree">
      <h2>The Pyramid Puzzle</h2>
      <p>
        The <b> pyramid puzzle </b> involves placing <b> 12 </b> unique shapes
        made of connected spheres onto a <b> pyramid </b> board. Your goal is to
        fit all pieces perfectly into the grid. Each shape is made from a
        different configuration of spheres, and you can use the <b> Solve </b>
        button to find the best way to complete the board.
      </p>
      <ProgressBar current={12 - shapes.length} total={12} variant="pyramid" />
      {shapes.length > 0 && (
        <PieceSelector
          shapes={shapes}
          selectedShape={selectedShape}
          setSelectedShape={setSelectedShape}
        />
      )}

      <div className="pyramid-area">
        <PyramidBoard
          board={board}
          highlightedCells={highlightedCells}
          selectedShape={selectedShape}
        />
        <PyramidLayerBoards
          board={board}
          setBoard={setBoard}
          highlightedCells={highlightedCells}
          setHighlightedCells={setHighlightedCells}
          selectedShape={selectedShape}
          setSelectedShape={setSelectedShape}
          setShapes={setShapes}
        />
      </div>
      <KeyboardControls
        keyMap={[
          {
            key: "r",
            keyAlias: "R",
            description: "Rotate piece",
            onClick: () => {
              if (!isSolving && selectedShape) {
                const newShape = { ...selectedShape };
                newShape.coords = normaliseShape(
                  rotateShapeCCW(newShape.coords)
                );
                setSelectedShape(newShape);
              }
            },
          },
          {
            key: "f",
            keyAlias: "F",
            description: "Flip piece",
            onClick: () => {
              if (!isSolving && selectedShape) {
                const newShape = { ...selectedShape };
                newShape.coords = normaliseShape(
                  flipShapeHorizontal(newShape.coords)
                );
                setSelectedShape(newShape);
              }
            },
          },
          {
            key: "ArrowLeft",
            keyAlias: "←",
            description: "Previous piece",
            onClick: () => {
              if (!isSolving && shapes.length > 0) {
                const currentIndex = shapes.findIndex(
                  (shape) => shape.symbol === selectedShape.symbol
                );
                const newIndex =
                  (currentIndex - 1 + shapes.length) % shapes.length;
                setSelectedShape(shapes[newIndex]);
              }
            },
          },
          {
            key: "ArrowRight",
            keyAlias: "→",
            description: "Next piece",
            onClick: () => {
              if (!isSolving && shapes.length > 0) {
                const currentIndex = shapes.findIndex(
                  (shape) => shape.symbol === selectedShape.symbol
                );
                const newIndex = (currentIndex + 1) % shapes.length;
                setSelectedShape(shapes[newIndex]);
              }
            },
          },
          {
            key: "Escape",
            keyAlias: "Esc",
            description: "Clear board",
            onClick: () => {
              if (!isSolving) {
                handleClear();
              }
            },
          },
          {
            key: "s",
            keyAlias: "S",
            description: "Solve (placeholder)",
            onClick: () => {
              console.log("Placeholder");
            },
          },
        ]}
      />
    </div>
  );
}

export default PyramidPuzzle;
