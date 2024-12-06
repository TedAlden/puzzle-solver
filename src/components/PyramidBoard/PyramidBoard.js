import "./PyramidBoard.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import pieces from "../../lib/pieces";

/**
 * PyramidBoard component renders the 3D pyramid board using Three.js.
 *
 * @param {Object} props Component properties.
 * @param {string[][][]} props.board A 3D array representing the board state.
 * @param {number[][]} props.highlightedCells A list of highlighted cells.
 * @param {Object} props.selectedShape The selected shape piece.
 * @returns {React.JSX.Element}
 */
function PyramidBoard({ board, highlightedCells, selectedShape }) {
  // Create a hashmap of piece symbols to the corresponding colour, e.g.
  // A:#ff0000
  const pieceColours = pieces.reduce((acc, piece) => {
    acc[piece.symbol] = piece.colour;
    return acc;
  }, {});

  /**
   * Renders the 3D pyramid board.
   *
   * @param {string[][][]} board The 3D array representing the board state.
   * @returns {React.JSX.Element[]}
   */
  const renderPyramid = (board) =>
    board.map((layer, layerIndex) =>
      layer.map((row, rowIndex) =>
        row.map((cell, cellIndex) => {
          // Calculuate 3D pyramid coordinates for the cell
          const x = (rowIndex - (row.length - 1) / 2) * 5;
          const z = (cellIndex - (row.length - 1) / 2) * 5;
          const y = layerIndex * 4 - (board.length - 1) * 2;
          // Check if cell has a shape piece placed in it
          const hasShapePlaced = cell !== "";
          // Check if cell is highlighted (hovered over)
          const isHighlighted = highlightedCells.some(
            (cell) =>
              cell[0] === rowIndex &&
              cell[1] === layerIndex &&
              cell[2] === cellIndex
          );
          // Determine cell opacity
          const opacity = hasShapePlaced ? 0.9 : 0.5;
          // Determine cell colour
          const colour = hasShapePlaced
            ? pieceColours[cell]
            : isHighlighted
            ? selectedShape.colour
            : "#ffffff";
          // Generate the cell sphere mesh
          return (
            <mesh position={[x, y, z]} key={`${x}-${y}-${z}`}>
              <sphereGeometry args={[2.5]} />
              <meshStandardMaterial
                transparent={true}
                opacity={opacity}
                color={colour}
              />
            </mesh>
          );
        })
      )
    );

  return (
    <div className="pyramid-board">
      <Canvas camera={{ position: [35, 15, 35], fov: 50 }}>
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
    </div>
  );
}

export default PyramidBoard;
