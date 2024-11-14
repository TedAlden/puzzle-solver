import "./PyramidPuzzle.css";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

/**
 * Creates a 3D pyramid puzzle with a given size.
 *
 * @param {number} size The size of the pyramid.
 * @returns {Array<Array<Array<number>>>} A 3D array representing the pyramid.
 */
const createPyramid = (size) =>
  Array.from({ length: size }, (_, i) =>
    Array.from({ length: size - i }, () => Array(size - i).fill(0))
  );

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

function PyramidPuzzle() {
  const pyramid = createPyramid(5);
  pyramid[0][4][4] = 1;

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
    <div className="puzzleThree">
      <h2>The Pyramid Puzzle</h2>
      <p>
        The <b> pyramid puzzle </b> involves placing <b> 12 </b> unique shapes
        made of connected spheres onto a <b> pyramid </b> board. Your goal is to
        fit all pieces perfectly into the grid. Each shape is made from a
        different configuration of spheres, and you can use the <b> Solve </b>
        button to find the best way to complete the board.
      </p>
      <Canvas
        camera={{
          position: [25, 25, 25],
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
        {renderPyramid(pyramid)}
      </Canvas>
    </div>
  );
}

export default PyramidPuzzle;
