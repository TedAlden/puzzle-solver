import './PolyspherePuzzle.css';
import { useState } from 'react';
import PolyBoard from '../PolyBoard/PolyBoard';
import PieceSelector from '../PieceSelector/PieceSelector';
import pieces from '../../lib/pieces';

const createBoard = (width, height) => (
  Array(height).fill().map(
    () => Array(width).fill("")
  )
);

function PolyspherePuzzle() {
  const [board, setBoard] = useState(createBoard(5, 11));
  const [shapes, setShapes] = useState(pieces);
  const [selectedShape, setSelectedShape] = useState(shapes[0]);

  return (
    <div className="puzzleTwo">
      <h2>The Polysphere Puzzle</h2>
      <p>
        This puzzle involves placing unique shapes made of connected
        spheres onto a 5x11 board. Your goal is to fit all 12 pieces
        perfectly into the grid. Each shape is made from a different
        configuration of spheres, and you can use the 'Solve' button to
        find the best way to complete the board.
      </p>
      <PieceSelector
        shapes={shapes}
        selectedShape={selectedShape}
        setSelectedShape={setSelectedShape}
      />
      <PolyBoard
        board={board}
        setBoard={setBoard}
        selectedShape={selectedShape}
        setSelectedShape={setSelectedShape}
        shapes={shapes}
        setShapes={setShapes}
      />
    </div>
  )
}

export default PolyspherePuzzle;
