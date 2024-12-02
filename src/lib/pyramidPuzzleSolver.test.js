import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import pyramidPuzzleSolver from "./pyramidPuzzleSolver";

describe("pyramidPuzzleSolver", () => {
  // Helper function to create an empty pyramid board
  const createEmptyPyramid = (size) => {
    const pyramid = [];
    for (let layer = 0; layer < size; layer++) {
      const layerSize = size - layer;
      const layerBoard = Array(layerSize).fill().map(() => 
        Array(layerSize).fill("")
      );
      pyramid.push(layerBoard);
    }
    return pyramid;
  };

  describe("Board Check", () => {
    it("Check for empty board", () => {
      const pyramid = createEmptyPyramid(3);
      const solutions = [];
      pyramidPuzzleSolver(pyramid, [], (solution) => solutions.push(solution));
      expect(solutions).toHaveLength(1);
      expect(solutions[0]).toEqual(pyramid);
    });

    it("Check for full board", () => {
      const pyramid = createEmptyPyramid(3).map(layer => 
        layer.map(row => row.map(() => "X"))
      );
      const pieces = [{
        symbol: "A",
        coords: [[0, 0, 0]],
        colour: "#ff0000"
      }];
      const solutions = [];
      pyramidPuzzleSolver(pyramid, pieces, (solution) => solutions.push(solution));
      expect(solutions).toHaveLength(0); 
    });
  });

  describe("Piece Placement", () => {
    let pyramid;
    
    beforeEach(() => {
      pyramid = createEmptyPyramid(3);
    });

    it("should place piece at valid position", () => {
      const piece = {
        symbol: "A",
        coords: [[0, 0, 0]],
        colour: "#ff0000"
      };
      const solutions = [];
      pyramidPuzzleSolver(pyramid, [piece], (solution) => solutions.push(solution));
      expect(solutions.length).toBeGreaterThan(0);
      // Check that the piece is placed somewhere in the pyramid
      expect(solutions[0].some(layer => 
        layer.some(row => row.includes("A"))
      )).toBeTruthy();
    });

    it("should handle piece that doesn't fit in pyramid", () => {
      const invalidPiece = {
        symbol: "X",
        coords: [  
        [0, 0],
        [15, 20] 
      ], // Outside pyramid board boundaries
        colour: "#ff0000"
      };
      const solutions = [];
      pyramidPuzzleSolver(pyramid, [invalidPiece], (solution) => solutions.push(solution));
      expect(solutions).toHaveLength(0);
    });
  });

  describe("Piece rotate and flip check", () => {
    it("should handle piece rotations", () => {
      const pyramid = createEmptyPyramid(3);
      const lPiece = {
        symbol: "L",
        coords: [[0, 0, 0], [1, 0, 0], [1, 0, 1]],
        colour: "#0000ff"
      };
      const solutions = [];
      pyramidPuzzleSolver(pyramid, [lPiece], (solution) => solutions.push(solution));
      expect(solutions.length).toBeGreaterThan(0);
    });

    it("should handle piece flips", () => {
      const pyramid = createEmptyPyramid(3);
      const zPiece = {
        symbol: "Z",
        coords: [[0, 0, 0], [0, 0, 1], [1, 0, 1], [1, 0, 2]],
        colour: "#ff00ff"
      };
      const solutions = [];
      pyramidPuzzleSolver(pyramid, [zPiece], (solution) => solutions.push(solution));
      expect(solutions.length).toBeGreaterThan(0);
    });
  });

  describe("Multiple Pieces", () => {
    it("should solve puzzle with multiple pieces", () => {
      const pyramid = createEmptyPyramid(2);
      const pieces = [
        {
          symbol: "A",
          coords: [[0, 0, 0]],
          colour: "#ff0000"
        },
        {
          symbol: "B",
          coords: [[0, 0, 0]],
          colour: "#00ff00"
        }
      ];
      const solutions = [];
      pyramidPuzzleSolver(pyramid, pieces, (solution) => solutions.push(solution));
      expect(solutions.length).toBeGreaterThan(0);
      // Verify all pieces are used
      const usedSymbols = new Set(solutions[0].flat(2).filter(cell => cell !== ""));
      expect(usedSymbols.size).toBe(pieces.length);
    });
  });

  describe("Solution function check", () => {
    it("should call onSolution for each solution found", () => {
      const pyramid = createEmptyPyramid(2);
      const piece = {
        symbol: "A",
        coords: [[1, 0, 0]],
        colour: "#ff0000"
      };
      const onSolution = jest.fn();
      pyramidPuzzleSolver(pyramid, [piece], onSolution);
      expect(onSolution).toHaveBeenCalled();
      const solution = onSolution.mock.calls[0][0];
      // Verify solution structure matches pyramid structure
      expect(solution).toHaveLength(2);
      expect(solution[0]).toHaveLength(2);
      expect(solution[1]).toHaveLength(1);
    });

    it("should not modify the original board", () => {
      const pyramid = createEmptyPyramid(2);
      const originalPyramid = JSON.parse(JSON.stringify(pyramid));
      const piece = {
        symbol: "A",
        coords: [[0, 0, 0]],
        colour: "#ff0000"
      };
      pyramidPuzzleSolver(pyramid, [piece], () => {});
      expect(pyramid).toEqual(originalPyramid);
    });
    
    it("should not modify the original pieces array", () => {
      const pyramid = createEmptyPyramid(2);
      const pieces = [{
        symbol: "A",
        coords: [[0, 0, 0]],
        colour: "#ff0000"
      }];
      const originalPieces = JSON.parse(JSON.stringify(pieces));
      pyramidPuzzleSolver(pyramid, pieces, () => {});
      expect(pieces).toEqual(originalPieces);
    });
  });
});