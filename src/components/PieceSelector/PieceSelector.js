import ShapePreview from '../ShapePreview/ShapePreview';

function PieceSelector({
  shapes,
  selectedShape,
  setSelectedShape
}) {
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
    newShape.coords = newShape.coords.map(([x, y]) => [y, -x]);
    setSelectedShape(newShape);
  }

  const flipShape = () => {
    const newShape = {...selectedShape};
    newShape.coords = newShape.coords.map(([x, y]) => [-x, y]);
    setSelectedShape(newShape);
  }

  return (
    <div className="shapeSelector">
      <button onClick={flipShape}>Flip</button>
      <button onClick={selectPreviousShape}>Prev</button>
      <ShapePreview selectedShape={selectedShape}/>
      <button onClick={selectNextShape}>Next</button>
      <button onClick={rotateShape}>Rotate</button>
    </div>
  );
}

export default PieceSelector;
