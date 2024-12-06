import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

/**
 * Axis label component that renders a text label in 3D space.
 *
 * @param {Object} props Component properties.
 * @param {string} props.text The text to display.
 * @param {THREE.Vector3} props.position The position of the label in 3D space.
 * @returns {React.JSX.Element}
 */
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

export default PiecePreview3D;
