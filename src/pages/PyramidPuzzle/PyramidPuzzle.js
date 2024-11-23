import "./PyramidPuzzle.css";
import { useState } from "react";
import ProgressBar from "../../components/Shared/ProgressBar/ProgressBar";
import PieceSelector from "../../components/Shared/PieceSelector/PieceSelector";
import pieces from "../../lib/pieces";
import PyramidBoard from "../../components/PyramidBoard/PyramidBoard";
import PyramidLayerBoards from "../../components/PyramidLayerBoards/PyramidLayerBoards";
import KeyboardControls from "../../components/Shared/KeyboardControls/KeyboardControls";

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
        <PyramidBoard board={board} highlightedCells={highlightedCells} />
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
