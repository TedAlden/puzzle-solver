import "./PyramidPiecePreview.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";

/**
 * A component that renders a 3D preview of a polysphere piece using Three.js.
 *
 * @param {Object} props Component properties.
 * @param {Object} props.selectedShape The currently selected shape piece.
 * @returns {JSX.Element}
 */
const PiecePreview3D = ({ selectedShape }) => {
  return (
    <Canvas camera={{ position: [4, 4, 4], fov: 75 }}>
      <OrbitControls
        enablePan={false}
        enableDamping={true}
        dampingFactor={0.1}
      />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      {selectedShape &&
        selectedShape.coords.map(([x, y, z], index) => (
          <Sphere
            key={index}
            args={[0.48, 40, 32]}
            position={[x * 0.9, y * 0.9, z * 0.9]}
          >
            <meshLambertMaterial
              attach="material"
              color={selectedShape.colour}
            />
          </Sphere>
        ))}
      <axesHelper args={[2]} />
    </Canvas>
  );
};

/**
 * A component for selecting and transforming polysphere pieces. Allows
 * users to navigate through a carousel of unused shapes, and flip or rotate
 * the selected shape.
 *
 * @param {Object} props Component properties
 * @param {Object} props.selectedShape The currently selected shape piece
 * @param {Function} props.onFlipX Function to flip the selected shape
 * @param {Function} props.onFlipY Function to flip the selected shape
 * @param {Function} props.onFlipZ Function to flip the selected shape
 * @param {Function} props.onRotateX Function to rotate the selected shape
 * @param {Function} props.onRotateY Function to rotate the selected shape
 * @param {Function} props.onRotateZ Function to rotate the selected shape
 * @param {Function} props.onPrevious Function to select the previous shape
 * @param {Function} props.onNext Function to select the next shape
 * @returns {JSX.Element}
 */
const PieceSelector3D = ({
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
      <div className="nav-controls">
        <button onClick={onPrevious}>Prev</button>
        <button onClick={onNext}>Next</button>
      </div>
      <div className="preview-section">
        <div className="flip-controls">
          <button onClick={onFlipX}>Flip X</button>
          <button onClick={onFlipY}>Flip Y</button>
          <button onClick={onFlipZ}>Flip Z</button>
        </div>
        <div className="preview-container">
          <PiecePreview3D selectedShape={selectedShape} />
        </div>
        <div className="rotate-controls">
          <button onClick={onRotateX}>Rotate X</button>
          <button onClick={onRotateY}>Rotate Y</button>
          <button onClick={onRotateZ}>Rotate Z</button>
        </div>
      </div>
    </div>
  );
};
export default PieceSelector3D;
