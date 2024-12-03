import "./PyramidPieceSelector.css";
import PiecePreview from "./PiecePreview";

/**
 * A component for selecting and transforming polysphere pieces. Allows
 * users to navigate through a carousel of unused shapes, and flip or rotate
 * the selected shape.
 *
 * @param {Object} props Component properties.
 * @param {Object} props.selectedShape The currently selected shape piece.
 * @param {Function} props.onFlipX Function to flip the selected shape.
 * @param {Function} props.onFlipY Function to flip the selected shape.
 * @param {Function} props.onFlipZ Function to flip the selected shape.
 * @param {Function} props.onRotateX Function to rotate the selected shape.
 * @param {Function} props.onRotateY Function to rotate the selected shape.
 * @param {Function} props.onRotateZ Function to rotate the selected shape.
 * @param {Function} props.onPrevious Function to select the previous shape.
 * @param {Function} props.onNext Function to select the next shape.
 * @returns {React.JSX.Element}
 */
const PyramidPieceSelector = ({
  selectedShape,
  onFlipX,
  onFlipY,
  onFlipZ,
  onRotateX,
  onRotateY,
  onRotateZ,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="pieceSelector3D">
      <div className="preview-section">
        <button onClick={onPrevious}>Prev</button>
        <div className="flip-controls">
          <button onClick={onFlipX}>Flip X</button>
          <button onClick={onFlipY}>Flip Y</button>
          <button onClick={onFlipZ}>Flip Z</button>
        </div>
        <div className="preview-container">
          <PiecePreview selectedShape={selectedShape} />
        </div>
        <div className="rotate-controls">
          <button onClick={onRotateX}>Rotate X</button>
          <button onClick={onRotateY}>Rotate Y</button>
          <button onClick={onRotateZ}>Rotate Z</button>
        </div>
        <button onClick={onNext}>Next</button>
      </div>
    </div>
  );
};
export default PyramidPieceSelector;
