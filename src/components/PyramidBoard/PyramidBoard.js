import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Piece(props) {
  return (
    <mesh {...props}>
      <sphereGeometry args={[2.5]} />
      <meshStandardMaterial
        transparent={true}
        opacity={0.7}
        color={props.shapeValue === 0 ? "#ffffff" : "#ff0000"}
      />
    </mesh>
  );
}

function PyramidBoard({ board }) {
  const renderPyramid = (pyramid) => {
    const size = pyramid.length;
    // Offset y coordinate to center the pyramid at (0, 0, 0)
    const heightOffset = (size - 1) * 2;
    const elements = [];
    for (let i = 0; i < size; i++) {
      const layerSize = size - i; // i.e. 5 for the first 5x5 layer
      const y = i * 4 - heightOffset;
      for (let j = 0; j < layerSize; j++) {
        for (let k = 0; k < layerSize; k++) {
          const x = (j - (layerSize - 1) / 2) * 5;
          const z = (k - (layerSize - 1) / 2) * 5;
          elements.push(
            <Piece
              key={`${j}-${i}-${k}`}
              position={[x, y, z]}
              shapeValue={pyramid[i][j][k]}
            />
          );
        }
      }
    }
    return elements;
  };

  return (
    <Canvas
      camera={{
        position: [35, 15, 35],
        fov: 50,
      }}
    >
      <ambientLight intensity={Math.PI / 2} />
      <pointLight position={[0, 20, 0]} decay={0} intensity={Math.PI} />
      <OrbitControls
        enablePan={false}
        target={[0, 0, 0]}
        enableDamping={true}
        dampingFactor={0.1}
      />
      {renderPyramid(board)}
    </Canvas>
  );
}

export default PyramidBoard;
