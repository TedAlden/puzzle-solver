import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import NQueenPuzzle from "./NQueenPuzzle";
import { solveNQueens } from "../../lib/nqueens";

// Mock the solveNQueens function
jest.mock("../../lib/nqueens", () => ({
  solveNQueens: jest.fn(),
}));

describe("NQueenPuzzle Component", () => {
  beforeEach(() => {
    // Clear any mock calls between tests
    solveNQueens.mockClear();
  });

  test("Calls solveNQueens and updates the board on success", () => {
    // Mock the solveNQueens function to return true (success)
    solveNQueens.mockReturnValue(true);

    render(<NQueenPuzzle />);

    // Click on the Solve button
    const solveButton = screen.getByRole("button", { name: /Solve/i });
    fireEvent.click(solveButton);

    // Ensure solveNQueens was called with the current board
    expect(solveNQueens).toHaveBeenCalled();

    // Check if the "Solution found" message is displayed
    const solutionText = screen.getByText(/Solution found/i);
    expect(solutionText).toBeInTheDocument();
  });

  test("Displays an alert when no solution is found", () => {
    // Mock the solveNQueens function to return false (failure)
    solveNQueens.mockReturnValue(false);

    // Mock the global alert function
    global.alert = jest.fn();

    render(<NQueenPuzzle />);

    // Click on the Solve button
    const solveButton = screen.getByRole("button", { name: /Solve/i });
    fireEvent.click(solveButton);

    // Check if the alert is called with the expected message
    expect(global.alert).toHaveBeenCalledWith("No possible Solutions found");
  });

  test("Clears the board when clicking the Clear button", () => {
    render(<NQueenPuzzle />);

    // Add some queens on the board manually
    const cells = screen.getAllByRole("button");
    fireEvent.click(cells[0]); // Simulate placing a queen on the first cell

    // Click on the Clear button
    const clearButton = screen.getByRole("button", { name: /Clear/i });
    fireEvent.click(clearButton);

    // Check if all cells are cleared (should not display queens)
    const clearedCells = screen.getAllByRole("button");
    clearedCells.forEach((cell) => {
      expect(cell).not.toHaveTextContent("♛");
      // Assuming the queen is represented by '♛'
    });
  });

  test("Renders the N-Queens puzzle with default board size", () => {
    render(<NQueenPuzzle />);

    // Check if the heading and description are rendered
    const headerElement = screen.getByText(/The N-Queens Puzzle/i);
    expect(headerElement).toBeInTheDocument();

    // Check if the default board size is set to 4
    const inputElement = screen.getByLabelText(/Board Size:/i);
    expect(inputElement).toHaveValue(4);

    // Get all board grid cells
    const cells = document.getElementsByClassName("board-cell");
    expect(cells.length).toBe(16); // 4x4 = 16 cells
  });

  test("Allows resizing the board", () => {
    render(<NQueenPuzzle />);

    const inputElement = screen.getByLabelText(/Board Size:/i);

    // Resize the board to 5x5
    fireEvent.change(inputElement, { target: { value: "5" } });

    // Check if the board is updated to 5x5
    const cells = document.getElementsByClassName("board-cell");
    expect(cells.length).toBe(25); // 5x5 = 25 cells
  });

  test("Can not resize board to size 0", () => {
    render(<NQueenPuzzle />);

    const inputElement = screen.getByLabelText(/Board Size:/i);

    // Attempt to resize to 0x0
    fireEvent.change(inputElement, { target: { value: "0" } });

    // make sure the board is not 0x0
    const cells = document.getElementsByClassName("board-cell");
    expect(cells.length).not.toBe(0);
  });
});
