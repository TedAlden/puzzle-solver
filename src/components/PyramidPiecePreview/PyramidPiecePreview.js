import "./PyramidPiecePreview.css";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

const AxisLabel = ({ text, position }) => {
  const color = text === "X" ? "#ff0000" : text === "Y" ? "#00ff00" : "#0088ff";
  const labelRef = useRef();

  // Make the label face the camera
  useFrame(({ camera }) => {
    if (labelRef.current) {
      labelRef.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <mesh position={position} ref={labelRef}>
      <Text text={text} fontSize={0.7} color={color} />
    </mesh>
  );
};

/**
 * A component that renders a 3D preview of a polysphere piece using Three.js.
 *
 * @param {Object} props Component properties.
 * @param {Object} props.selectedShape The currently selected shape piece.
 * @returns {React.JSX.Element}
 */
const PiecePreview3D = ({ selectedShape }) => {
  /**
   * Transform a shape coordinate into a 3D pyramid coordinate.
   *
   * @param {number} x The shape X coordinate.
   * @param {number} y The shape Y coordinate.
   * @param {number} z The shape Z coordinate.
   * @returns {Array<number>} The 3D pyramid coordinate of the shape piece.
   */
  const calcPosition = (x, y, z) => [x + 0.5 * y, y * 0.8, z + 0.5 * y];

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
        selectedShape.coords.map(([x, y, z]) => (
          <mesh position={calcPosition(x, y, z)} key={`${x}-${y}-${z}`}>
            <sphereGeometry args={[0.5]} />
            <meshStandardMaterial color={selectedShape.colour} />
          </mesh>
        ))}
      <axesHelper args={[3]} />
      <AxisLabel text="X" position={new THREE.Vector3(3.5, 0, 0)} />
      <AxisLabel text="Y" position={new THREE.Vector3(0, 3.5, 0)} />
      <AxisLabel text="Z" position={new THREE.Vector3(0, 0, 3.5)} />
    </Canvas>
  );
};

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
      <div className="preview-section">
        <button onClick={onPrevious}>Prev</button>
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
        <button onClick={onNext}>Next</button>
      </div>
    </div>
  );
};
export default PieceSelector3D;
