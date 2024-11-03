import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import solvePolyspheres from './polysphereSolver';

describe('PolysphereSolver', () => {
  const testPieces = [
    {
      symbol: 'A',
      coords: [[0, 0], [0, 1]],
      colour: '#ff0000'
    },
    {
      symbol: 'B',
      coords: [[0, 0], [1, 0]],
      colour: '#00ff00'
    }
  ];
  const createEmptyBoard = (rows, cols) => 
    Array(rows).fill().map(() => Array(cols).fill(""));

  describe('Board Check', () => {

    it('Check for empty board', () => {
      const board = createEmptyBoard(5, 11);
      const solutions = [];
      const onSolution = (solution) => solutions.push(solution);

      solvePolyspheres(board, [], onSolution);
      expect(solutions).toHaveLength(1);
    });
  });

  describe('to check the Piece placement', () => {
    let board;
    
    beforeEach(() => {
      board = createEmptyBoard(5, 11);
    });

    it('should place piece at valid position', () => {
      const solutions = [];
      const onSolution = (solution) => solutions.push(solution);
      const testPiece = {
        symbol: 'A',
        coords: [[0, 0], [0, 1]],
        colour: '#ff0000'
      };

      solvePolyspheres(board, [testPiece], onSolution);
      expect(solutions.length).toBeGreaterThan(0);
    });

    it('to check when piece size is invalid', () => {
      const solutions = [];
      const onSolution = (solution) => solutions.push(solution);
      const invalidPiece = {
        symbol: 'X',
        coords: [[0, 0], [15, 20]], // Outside board boundaries
        colour: '#ff0000'
      };

      solvePolyspheres(board, [invalidPiece], onSolution);
      expect(solutions).toHaveLength(0);
    });
  });

  describe('Piece rotate and flip check', () => {
    it('should handle piece rotations', () => {
      const board = createEmptyBoard(2, 2);
      const solutions = [];
      const onSolution = (solution) => solutions.push(solution);
      const LPiece = {
        symbol: 'L',
        coords: [[0, 0], [1, 0], [1, 1]],
        colour: '#ff0000'
      };

      solvePolyspheres(board, [LPiece], onSolution);
      expect(solutions.length).toBeGreaterThan(0);
    });

    it('should handle piece flips', () => {
      const board = createEmptyBoard(2, 3);
      const solutions = [];
      const onSolution = (solution) => solutions.push(solution);
      const ZPiece = {
        symbol: 'Z',
        coords: [[0, 0], [0, 1], [1, 1], [1, 2]],
        colour: '#ff0000'
      };

      solvePolyspheres(board, [ZPiece], onSolution);
      expect(solutions.length).toBeGreaterThan(0);
    });
  });

  describe('Solution function check', () => {
    it('should call onSolution for each solution found', () => {
      const board = createEmptyBoard(5, 11);
      const onSolution = jest.fn();

      solvePolyspheres(board, testPieces, onSolution);
      expect(onSolution).toHaveBeenCalled();
    });

    it('should provide valid board state in solutions', () => {
      const board = createEmptyBoard(5, 11);
      const solutions = [];
      const onSolution = (solution) => {
        solutions.push(solution);
        // Check if solution has valid symbols
        expect(solution.flat().filter(cell => cell !== ""))
          .toEqual(expect.arrayContaining(['A', 'B']));
      };

      solvePolyspheres(board, testPieces, onSolution);
      expect(solutions.length).toBeGreaterThan(0);
    });
    
  }); 
  
});