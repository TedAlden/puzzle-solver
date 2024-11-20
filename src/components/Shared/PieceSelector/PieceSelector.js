import "./PieceSelector.css";
import ShapePreview from "../ShapePreview/ShapePreview";
import {
  flipShapeHorizontal,
  normaliseShape,
  rotateShapeCCW,
} from "../../../lib/utils";

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
function PieceSelector({
  shapes,
  selectedShape,
  setSelectedShape,
  variant = "polysphere",
}) {
  /**
   * Selects the previous shape in the shapes array. Wraps to the end of the
   * list if the current shape is the first element.
   */
  const handlePreviousShape = () => {
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
  const handleNextShape = () => {
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
  const handleRotateShape = () => {
    const newShape = { ...selectedShape };
    newShape.coords = normaliseShape(rotateShapeCCW(newShape.coords));
    setSelectedShape(newShape);
  };

  /**
   * Flips the selected shape horizontally and updates the selected shape's
   * coordinates with the normalized flipped version.
   */
  const handleFlipShape = () => {
    const newShape = { ...selectedShape };
    newShape.coords = normaliseShape(flipShapeHorizontal(newShape.coords));
    setSelectedShape(newShape);
  };

  return (
    <div className="pieceSelector">
      <button onClick={handleFlipShape}>Flip</button>
      <button onClick={handlePreviousShape}>Prev</button>
      <ShapePreview selectedShape={selectedShape} />
      <button onClick={handleNextShape}>Next</button>
      <button onClick={handleRotateShape}>Rotate</button>
    </div>
  );
}

export default PieceSelector;
