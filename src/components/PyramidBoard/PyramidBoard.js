import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import PyramidCell from "../PyramidCell/PyramidCell";
import pieces from "../../lib/pieces";

function PyramidBoard({ board, highlightedCells, selectedShape }) {
  const renderPyramid = (pyramid) => {
    const size = pyramid.length;
    // Offset y coordinate to center the pyramid at (0, 0, 0)
    const heightOffset = (size - 1) * 2;
    const spheres = [];
    for (let i = 0; i < size; i++) {
      const layerSize = size - i; // i.e. 5 for the first 5x5 layer
      const y = i * 4 - heightOffset;
      for (let j = 0; j < layerSize; j++) {
        for (let k = 0; k < layerSize; k++) {
          const x = (j - (layerSize - 1) / 2) * 5;
          const z = -(k - (layerSize - 1) / 2) * 5;
          const hasShapePlaced = pyramid[i][j][k] !== "";
          const isHighlighted = highlightedCells.some(
            (cell) => cell[0] === j && cell[1] === i && cell[2] === k
          );
          // Determine cell opacity
          const opacity = hasShapePlaced ? 0.9 : 0.5;
          // Determine cell colour
          let colour = "#ffffff";
          if (hasShapePlaced) {
            // If there is a shape piece placed in the cell, look up the colour
            const piece = pieces.find(
              (piece) => piece.symbol === pyramid[i][j][k]
            );
            colour = piece.colour;
          } else if (isHighlighted) {
            // Otherwise, if the cell is highlighted (being hovered over), use
            // the current selected shape's colour
            colour = selectedShape.colour;
          }
          // Add the sphere mesh to the list
          spheres.push(
            <PyramidCell
              position={[x, y, z]}
              opacity={opacity}
              colour={colour}
            />
          );
        }
      }
    }
    return spheres;
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
