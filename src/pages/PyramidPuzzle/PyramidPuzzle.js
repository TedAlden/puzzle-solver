import "./PyramidPuzzle.css";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Piece(props) {
  const [hovered, setHover] = useState(false);

  return (
    <mesh
      {...props}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <sphereGeometry args={[2.5]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

function PyramidPuzzle() {
  return (
    <div className="puzzleThree">
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
        <Piece position={[-5, 0, -5]} />
        <Piece position={[0, 0, -5]} />
        <Piece position={[5, 0, -5]} />
        <Piece position={[-5, 0, 0]} />
        <Piece position={[0, 0, 0]} />
        <Piece position={[5, 0, 0]} />
        <Piece position={[-5, 0, 5]} />
        <Piece position={[0, 0, 5]} />
        <Piece position={[5, 0, 5]} />
        <Piece position={[-2.5, 4, -2.5]} />
        <Piece position={[2.5, 4, -2.5]} />
        <Piece position={[-2.5, 4, 2.5]} />
        <Piece position={[2.5, 4, 2.5]} />
        <Piece position={[0, 8, 0]} />
      </Canvas>
    </div>
  );
}

export default PyramidPuzzle;
