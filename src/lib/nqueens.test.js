const {isValid, isSafe, solveNQueens} = require("./nqueens");

describe("Test isValid function", () => {
    test("Horizontal line of sight is invalid", () => {
        let board = [
            [0, 0, 0, 1, 1],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ]
        expect(isValid(board)).toBe(false);
    });
    test("Horizontal line of sight is invalid", () => {
        let board = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 1, 0, 0, 1],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ]
        expect(isValid(board)).toBe(false);
    });
    test("Vertical line of sight is invalid", () => {
        let board = [
            [0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1]
        ]
        expect(isValid(board)).toBe(false);
    });
    test("Vertical line of sight is invalid", () => {
        let board = [
            [1, 0, 0, 0, 0],
            [1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ]
        expect(isValid(board)).toBe(false);
    });
    test("Vertical line of sight is invalid", () => {
        let board = [
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0]
        ]
        expect(isValid(board)).toBe(false);
    });
    test("Diagonal line of sight is invalid", () => {
        let board = [
            [1, 0, 0, 0, 0],
            [0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ]
        expect(isValid(board)).toBe(false);
    });
    test("Diagonal line of sight is invalid", () => {
        let board = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0]
        ]
        expect(isValid(board)).toBe(false);
    });
    test("Diagonal line of sight is invalid", () => {
        let board = [
            [0, 0, 0, 0, 1],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0]
        ]
        expect(isValid(board)).toBe(false);
    });
    test("Diagonal line of sight is invalid", () => {
        let board = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1],
            [0, 0, 0, 1, 0]
        ]
        expect(isValid(board)).toBe(false);
    });
});

describe("Test isSafe function", () => {
    let board = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
    ]
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
    test("No line of sight makes placement safe", () => {
        expect(isSafe(board, 0, 1)).toBe(true);
    });
    test("No line of sight makes placement safe", () => {
        expect(isSafe(board, 0, 3)).toBe(true);
    });
    test("No line of sight makes placement safe", () => {
        expect(isSafe(board, 1, 0)).toBe(true);
    });
    test("No line of sight makes placement safe", () => {
        expect(isSafe(board, 3, 0)).toBe(true);
    });
    test("No line of sight makes placement safe", () => {
        expect(isSafe(board, 1, 4)).toBe(true);
    });
    test("No line of sight makes placement safe", () => {
        expect(isSafe(board, 3, 4)).toBe(true);
    });
    test("No line of sight makes placement safe", () => {
        expect(isSafe(board, 4, 1)).toBe(true);
    });
    test("No line of sight makes placement safe", () => {
        expect(isSafe(board, 4, 3)).toBe(true);
    });
});
