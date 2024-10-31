import './PieceSelector.css';
import ShapePreview from '../ShapePreview/ShapePreview';

function PieceSelector({
  shapes,
  selectedShape,
  setSelectedShape
}) {
  // Normalise the shape so the top-left tile is aligned to (0, 0)
  const normalise = (coords) => {
    const minRow = Math.min(...coords.map(([r, _]) => r));
    const minCol = Math.min(...coords.map(([_, c]) => c));
    return coords.map(([r, c]) => [r - minRow, c - minCol]);
  };

  const selectPreviousShape = () => {
    const currentIndex = shapes.findIndex(
      shape => shape.symbol === selectedShape.symbol
    );
    const newIndex = (currentIndex - 1 + shapes.length) % shapes.length;
    setSelectedShape(shapes[newIndex]);
  }

  const selectNextShape = () => {
    const currentIndex = shapes.findIndex(
      shape => shape.symbol === selectedShape.symbol
    );
    const newIndex = (currentIndex + 1) % shapes.length;
    setSelectedShape(shapes[newIndex]);
  }

  const rotateShape = () => {
    const newShape = {...selectedShape};
    newShape.coords = normalise(newShape.coords.map(([x, y]) => [y, -x]));
    setSelectedShape(newShape);
  }

  const flipShape = () => {
    const newShape = {...selectedShape};
    newShape.coords = normalise(newShape.coords.map(([x, y]) => [-x, y]));
    setSelectedShape(newShape);
  }

  return (
    <div className="pieceSelector">
      <button onClick={flipShape}>Flip</button>
      <button onClick={selectPreviousShape}>Prev</button>
      <ShapePreview selectedShape={selectedShape}/>
      <button onClick={selectNextShape}>Next</button>
      <button onClick={rotateShape}>Rotate</button>
    </div>
  );
}

export default PieceSelector;
