import "./PieceSelector.css";
import ShapePreview from "../ShapePreview/ShapePreview";

/**
 * A component for selecting and transforming polysphere shape pieces. Allows
 * users to navigate through a carousel of unused shapes, and flip or rotate
 * the selected shape.
 *
 * @param {Object} props Component properties.
 * @param {Array<Object>} props.shapes Array of shape objects.
 * @param {Object} props.selectedShape The currently selected shape object.
 * @param {function} props.setSelectedShape Callback to update the selected
 *  shape.
 * @returns {JSX.Element}
 */
function PieceSelector({ shapes, selectedShape, setSelectedShape }) {
  /**
   * Normalise the shape so the top-left tile is aligned to (0, 0).
   * @param {Array<Array<number>>} coords The shape as an array of [x, y]
   *  coordinate pairs.
   * @returns {Array<Array<number>>} The normalized shape coordinates.
   */
  const normalise = (coords) => {
    const minRow = Math.min(...coords.map(([r, _]) => r));
    const minCol = Math.min(...coords.map(([_, c]) => c));
    return coords.map(([r, c]) => [r - minRow, c - minCol]);
  };

  /**
   * Selects the previous shape in the shapes array. Wraps to the end of the
   * list if the current shape is the first element.
   */
  const selectPreviousShape = () => {
    const currentIndex = shapes.findIndex(
      (shape) => shape.symbol === selectedShape.symbol
    );
    const newIndex = (currentIndex - 1 + shapes.length) % shapes.length;
    setSelectedShape(shapes[newIndex]);
  };

  /**
   * Selects the next shape in the shapes array. Wraps to the start of the list
   * if the current shape is the last element.
   */
  const selectNextShape = () => {
    const currentIndex = shapes.findIndex(
      (shape) => shape.symbol === selectedShape.symbol
    );
    const newIndex = (currentIndex + 1) % shapes.length;
    setSelectedShape(shapes[newIndex]);
  };

  /**
   * Rotates the selected shape 90 degrees clockwise and updates the selected
   * shape's coordinates with the normalized rotated version.
   */
  const rotateShape = () => {
    const newShape = { ...selectedShape };
    newShape.coords = normalise(newShape.coords.map(([x, y]) => [y, -x]));
    setSelectedShape(newShape);
  };

  /**
   * Flips the selected shape horizontally and updates the selected shape's
   * coordinates with the normalized flipped version.
   */
  const flipShape = () => {
    const newShape = { ...selectedShape };
    newShape.coords = normalise(newShape.coords.map(([x, y]) => [-x, y]));
    setSelectedShape(newShape);
  };

  return (
    <div className="pieceSelector">
      <button onClick={flipShape}>Flip</button>
      <button onClick={selectPreviousShape}>Prev</button>
      <ShapePreview selectedShape={selectedShape} />
      <button onClick={selectNextShape}>Next</button>
      <button onClick={rotateShape}>Rotate</button>
    </div>
  );
}

export default PieceSelector;
