import "./PyramidPuzzle.css";
import { useEffect, useState } from "react";
import PyramidBoard from "../../components/PyramidBoard/PyramidBoard";

/**
 * Creates a 3D pyramid puzzle with a given size.
 *
 * @param {number} size The size of the pyramid.
 * @returns {Array<Array<Array<number>>>} A 3D array representing the pyramid.
 */
const createPyramid = (size) =>
  Array.from({ length: size }, (_, i) =>
    Array.from({ length: size - i }, () => Array(size - i).fill(0))
  );

function PyramidPuzzle() {
  const [board, setBoard] = useState(createPyramid(5));

  useEffect(() => {
    const newPyramid = createPyramid(5);
    newPyramid[0][4][4] = 1;
    setBoard(newPyramid);
  }, []);

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
      <PyramidBoard board={board} />
    </div>
  );
}

export default PyramidPuzzle;
