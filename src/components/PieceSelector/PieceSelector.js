import "./PieceSelector.css";
import PiecePreview from "../PiecePreview/PiecePreview";

/**
 * A component for selecting and transforming polysphere shape pieces. Allows
 * users to navigate through a carousel of unused shapes, and flip or rotate
 * the selected shape.
 *
 * @param {Object} props Component properties.
 * @param {Object} props.selectedShape The currently selected shape piece.
 * @param {Function} props.handleFlipShape A function to flip the selected
 *  shape.
 * @param {Function} props.handlePreviousShape A function to select the previous
 *  shape in the carousel.
 * @param {Function} props.handleNextShape A function to select the next shape
 *  in the carousel.
 * @param {Function} props.handleRotateShape A function to rotate the selected
 *  shape.
 * @returns {JSX.Element}
 */
function PieceSelector({
  selectedShape,
  handleFlipShape,
  handlePreviousShape,
  handleNextShape,
  handleRotateShape,
}) {
  return (
    <div className="pieceSelector">
      <button onClick={handleFlipShape}>Flip</button>
      <button onClick={handlePreviousShape}>Prev</button>
      <PiecePreview selectedShape={selectedShape} />
      <button onClick={handleNextShape}>Next</button>
      <button onClick={handleRotateShape}>Rotate</button>
    </div>
  );
}

export default PieceSelector;
