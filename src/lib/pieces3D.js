import { convert2Dto3D } from "./utils";
import pieces from "./pieces"; // Import original 2D pieces

// Convert 2D pieces to 3D for the pyramid puzzle
const pieces3D = pieces.map((piece) => ({
  ...piece,
  coords: convert2Dto3D(piece.coords), // Default y = 0 for flat pieces
}));

export default pieces3D;