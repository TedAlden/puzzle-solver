import "./PyramidPuzzle.css";
import { useEffect, useState } from "react";
import ProgressBar from "../../components/Shared/ProgressBar/ProgressBar";
import PieceSelector from "../../components/Shared/PieceSelector/PieceSelector";
import pieces from "../../lib/pieces";
import PyramidBoard from "../../components/PyramidBoard/PyramidBoard";
import KeyboardControls from "../../components/Shared/KeyboardControls/KeyboardControls";

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

  // eslint-disable-next-line no-unused-vars
  const [shapes, setShapes] = useState(pieces);
  const [selectedShape, setSelectedShape] = useState(shapes[0]);

  const [selectedIndex, setSelectedIndex] = useState([0, 0, 0]); // y, x, z

  useEffect(() => {
    // update highlighted cells when index changes
    const highlightedCells = selectedShape.coords.map(([x, z]) => [
      x + selectedIndex[1],
      0 + selectedIndex[0],
      z + selectedIndex[2],
    ]);

    const newBoard = board.map((level, y) =>
      level.map((row, x) =>
        row.map((cell, z) => {
          if (
            highlightedCells.some(
              ([hx, hy, hz]) => hx === x && hy === y && hz === z
            )
          ) {
            return selectedShape.symbol;
          }
          return 0;
        })
      )
    );
    setBoard(newBoard);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, selectedShape]);

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
      <PyramidBoard board={board} />
      <KeyboardControls
        keyMap={[
          {
            key: "ArrowRight",
            keyAlias: "→",
            description: "Move shape right",
            onClick: () => {
              var [y, x, z] = selectedIndex;
              setSelectedIndex([y, x, z - 1]);
            },
          },
          {
            key: "ArrowLeft",
            keyAlias: "←",
            description: "Move shape left",
            onClick: () => {
              var [y, x, z] = selectedIndex;
              setSelectedIndex([y, x, z + 1]);
            },
          },
          {
            key: "ArrowUp",
            keyAlias: "↑",
            description: "Move shape forwards",
            onClick: () => {
              var [y, x, z] = selectedIndex;
              setSelectedIndex([y, x - 1, z]);
            },
          },
          {
            key: "ArrowDown",
            keyAlias: "↓",
            description: "Move shape backwards",
            onClick: () => {
              var [y, x, z] = selectedIndex;
              var newIndex = [y, x + 1, z];
              setSelectedIndex(newIndex);
            },
          },
          {
            key: "w",
            keyAlias: "W",
            description: "Move shape up",
            onClick: () => {
              var [y, x, z] = selectedIndex;
              setSelectedIndex([y + 1, x, z]);
            },
          },
          {
            key: "s",
            keyAlias: "S",
            description: "Move shape down",
            onClick: () => {
              var [y, x, z] = selectedIndex;
              setSelectedIndex([y - 1, x, z]);
            },
          },
        ]}
      />
    </div>
  );
}

export default PyramidPuzzle;
