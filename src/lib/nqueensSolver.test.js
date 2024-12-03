import { isValid, isSafe, solveNQueens } from "./nqueensSolver";

describe("Test isValid function", () => {
  test("Horizontal line of sight is invalid #1", () => {
    let board = [
      [0, 0, 0, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];
    expect(isValid(board)).toBe(false);
  });
  test("Horizontal line of sight is invalid #2", () => {
    let board = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 1, 0, 0, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];
    expect(isValid(board)).toBe(false);
  });
  test("Vertical line of sight is invalid #1", () => {
    let board = [
      [0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1],
    ];
    expect(isValid(board)).toBe(false);
  });
  test("Vertical line of sight is invalid #2", () => {
    let board = [
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];
    expect(isValid(board)).toBe(false);
  });
  test("Vertical line of sight is invalid #3", () => {
    let board = [
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
    ];
    expect(isValid(board)).toBe(false);
  });
  test("Diagonal line of sight is invalid #1", () => {
    let board = [
      [1, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];
    expect(isValid(board)).toBe(false);
  });
  test("Diagonal line of sight is invalid #2", () => {
    let board = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0],
    ];
    expect(isValid(board)).toBe(false);
  });
  test("Diagonal line of sight is invalid #3", () => {
    let board = [
      [0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
    ];
    expect(isValid(board)).toBe(false);
  });
  test("Diagonal line of sight is invalid #4", () => {
    let board = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1],
      [0, 0, 0, 1, 0],
    ];
    expect(isValid(board)).toBe(false);
  });
});

describe("Test isSafe function", () => {
  let board = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ];
  test("Left is not safe", () => {
    expect(isSafe(board, 2, 0)).toBe(false);
  });
  test("Right is not safe", () => {
    expect(isSafe(board, 2, 4)).toBe(false);
  });
  test("Top is not safe", () => {
    expect(isSafe(board, 0, 2)).toBe(false);
  });
  test("Bottom is not safe", () => {
    expect(isSafe(board, 4, 2)).toBe(false);
  });
  test("Top-left is not safe", () => {
    expect(isSafe(board, 0, 0)).toBe(false);
  });
  test("Top-right is not safe", () => {
    expect(isSafe(board, 0, 4)).toBe(false);
  });
  test("Bottom-left is not safe", () => {
    expect(isSafe(board, 4, 0)).toBe(false);
  });
  test("Bottom-right is not safe", () => {
    expect(isSafe(board, 4, 4)).toBe(false);
  });
  test("No line of sight makes placement safe #1", () => {
    expect(isSafe(board, 0, 1)).toBe(true);
  });
  test("No line of sight makes placement safe #2", () => {
    expect(isSafe(board, 0, 3)).toBe(true);
  });
  test("No line of sight makes placement safe #3", () => {
    expect(isSafe(board, 1, 0)).toBe(true);
  });
  test("No line of sight makes placement safe #4", () => {
    expect(isSafe(board, 3, 0)).toBe(true);
  });
  test("No line of sight makes placement safe #5", () => {
    expect(isSafe(board, 1, 4)).toBe(true);
  });
  test("No line of sight makes placement safe #6", () => {
    expect(isSafe(board, 3, 4)).toBe(true);
  });
  test("No line of sight makes placement safe #7", () => {
    expect(isSafe(board, 4, 1)).toBe(true);
  });
  test("No line of sight makes placement safe #8", () => {
    expect(isSafe(board, 4, 3)).toBe(true);
  });
});

describe("Test solveNQueens function", () => {
  test("4x4 has no solutions with queen in corner", () => {
    let board = [
      [0, 0, 0, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    expect(solveNQueens(board)).toBe(false);
  });
  test("4x4 has a solution with queen in (0, 2)", () => {
    let board = [
      [0, 0, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    expect(solveNQueens(board)).toBe(true);
  });
  test("Solver rejects invalid board", () => {
    let board = [
      [0, 0, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    expect(solveNQueens(board)).toBe(false);
  });
});
