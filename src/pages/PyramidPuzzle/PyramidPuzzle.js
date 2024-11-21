import "./PyramidPuzzle.css";
import { useEffect, useState } from "react";
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

  const isValidMove = (newIndex) => {
    const [newY, newX, newZ] = newIndex;

    return selectedShape.coords.every(([dx, dz]) => {
      const targetY = newY;
      const targetX = newX + dx;
      const targetZ = newZ + dz;

      // Check if the target layer exists
      if (targetY < 0 || targetY >= board.length) return false;

      // Check if the target row exists within the layer
      if (targetX < 0 || targetX >= board[targetY].length) return false;

      // Check if the target cell exists within the row
      if (targetZ < 0 || targetZ >= board[targetY][targetX].length)
        return false;

      return true;
    });
  };

  // eslint-disable-next-line no-unused-vars
  const [shapes, setShapes] = useState(pieces);
  const [selectedShape, setSelectedShape] = useState(shapes[0]);

  const [selectedIndex, setSelectedIndex] = useState([0, 0, 0]); // y, x, z
  const [highlightedCells, setHighlightedCells] = useState([]);

  useEffect(() => {
    // update highlighted cells when selected index (or shape) changes
    const highlightedCells = selectedShape.coords.map(([x, z]) => [
      x + selectedIndex[1],
      0 + selectedIndex[0],
      z + selectedIndex[2],
    ]);
    setHighlightedCells(highlightedCells);
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

      <div className ="pyramid-area">
      <PyramidBoard board={board} highlightedCells={highlightedCells} />
      <PyramidLayerBoards
        board={board}
        highlightedCells={highlightedCells}
        selectedShape={selectedShape}
      />
      </div>
      <KeyboardControls
        keyMap={[
          {
            key: "ArrowRight",
            keyAlias: "→",
            description: "Move shape right",
            onClick: () => {
              const [y, x, z] = selectedIndex;
              const newIndex = [y, x, z - 1];
              if (isValidMove(newIndex)) {
                setSelectedIndex(newIndex);
              }
            },
          },
          {
            key: "ArrowLeft",
            keyAlias: "←",
            description: "Move shape left",
            onClick: () => {
              const [y, x, z] = selectedIndex;
              const newIndex = [y, x, z + 1];
              if (isValidMove(newIndex)) {
                setSelectedIndex(newIndex);
              }
            },
          },
          {
            key: "ArrowUp",
            keyAlias: "↑",
            description: "Move shape forwards",
            onClick: () => {
              const [y, x, z] = selectedIndex;
              const newIndex = [y, x - 1, z];
              if (isValidMove(newIndex)) {
                setSelectedIndex(newIndex);
              }
            },
          },
          {
            key: "ArrowDown",
            keyAlias: "↓",
            description: "Move shape backwards",
            onClick: () => {
              const [y, x, z] = selectedIndex;
              const newIndex = [y, x + 1, z];
              if (isValidMove(newIndex)) {
                setSelectedIndex(newIndex);
              }
            },
          },
          {
            key: "w",
            keyAlias: "W",
            description: "Move shape up",
            onClick: () => {
              const [y, x, z] = selectedIndex;
              // when moving upwards, there are multiple different directions
              // to choose from, since the layers are not vertically
              // stacked/aligned.
              const newIndices = [
                [y + 1, x, z],
                [y + 1, x - 1, z - 1],
                [y + 1, x - 1, z],
                [y + 1, x, z - 1],
              ];
              newIndices.forEach((newIndex) => {
                if (isValidMove(newIndex)) {
                  setSelectedIndex(newIndex);
                  return;
                }
              });
            },
          },
          {
            key: "s",
            keyAlias: "S",
            description: "Move shape down",
            onClick: () => {
              const [y, x, z] = selectedIndex;
              const newIndex = [y - 1, x, z];
              if (isValidMove(newIndex)) {
                setSelectedIndex(newIndex);
              }
            },
          },
          {
            key: "d",
            keyAlias: "D",
            description: "Place shape",
            onClick: () => {
              const [y, x, z] = selectedIndex;
              // Map the coords of each shape tile to the current selected index
              // to calculate the coords of each shape tile on the board
              const shapeIndices = selectedShape.coords.map(([dx, dz]) => [
                y,
                x + dx,
                z + dz,
              ]);
              // Check if any of the shape tiles are already occupied
              const isSpaceOccupied = shapeIndices.some(
                ([dy, dx, dz]) => board[dy][dx][dz] !== ""
              );
              // If there is space, then:
              if (!isSpaceOccupied) {
                // 1. place the shape on the pyramid board
                setBoard(
                  board.map((layer, i) =>
                    layer.map((row, j) =>
                      row.map((cell, k) =>
                        shapeIndices.some(
                          ([dy, dx, dz]) => dy === i && dx === j && dz === k
                        )
                          ? selectedShape.symbol
                          : cell
                      )
                    )
                  )
                );
                // 2. remove the shape from our inventory of available shapes
                setShapes((prevShapes) => {
                  const newShapes = prevShapes.filter(
                    (shape) => shape.symbol !== selectedShape.symbol
                  );
                  setSelectedShape(newShapes[0] || null);
                  return newShapes;
                });
              }
            },
          },
        ]}
      />
    </div>
  );
}

export default PyramidPuzzle;
