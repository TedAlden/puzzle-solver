import { render, screen, fireEvent } from "@testing-library/react";
import NQueenPuzzle from "./NQueenPuzzle";
import { solveNQueens } from "../../lib/nqueens";

// Mock the NQueens solver algorithm
jest.mock("../../lib/nqueens", () => ({
  solveNQueens: jest.fn(),
}));

describe("NQueenPuzzle Component", () => {
  // Clear solver algorithm mock calls before each test
  beforeEach(() => {
    solveNQueens.mockClear();
  });

  it("displays an alert when a solution is found", () => {
    // Mock the solveNQueens function to return true (solution found)
    solveNQueens.mockReturnValue(true);
    render(<NQueenPuzzle />);
    // Click on the Solve button
    const solveButton = screen.getByRole("button", { name: /Solve/i });
    fireEvent.click(solveButton);
    expect(solveNQueens).toHaveBeenCalled();
    // Check if the "Solution found" message is displayed
    const solutionText = screen.getByText(/Solution found/i);
    expect(solutionText).toBeInTheDocument();
  });

  it("displays an alert when no solution is found", () => {
    // Mock the solveNQueens function to return false (no solutions found)
    solveNQueens.mockReturnValue(false);
    global.alert = jest.fn();
    render(<NQueenPuzzle />);
    // Click on the Solve button
    const solveButton = screen.getByRole("button", { name: /Solve/i });
    fireEvent.click(solveButton);
    expect(solveNQueens).toHaveBeenCalled();
    // Check if the "No solutions found" alert is displayed
    expect(global.alert).toHaveBeenCalledWith("No possible Solutions found");
  });

  it("places a cell on the board when clicking on it", () => {
    render(<NQueenPuzzle />);
    // Click on cell (0, 0)
    const cells = screen.getAllByRole("cell");
    fireEvent.click(cells[0]);
    // Expect a queen to show in that cell
    expect(cells[0]).toHaveTextContent("♛");
  });

  it("toggles the placement of a queen in a cell when clicked", () => {
    render(<NQueenPuzzle />);
    // Click on cell (0, 0)
    const cells = screen.getAllByRole("cell");
    fireEvent.click(cells[0]);
    // Expect a queen to show in that cell
    expect(cells[0]).toHaveTextContent("♛");
    // Click on cell (0, 0) again to remove the queen
    fireEvent.click(cells[0]);
    // Expect the cell to be empty
    expect(cells[0]).not.toHaveTextContent("♛");
  });

  it("clears the board when clicking the Clear button", () => {
    render(<NQueenPuzzle />);
    // Add a queen manually to (0, 0)
    const cells = screen.getAllByRole("cell");
    fireEvent.click(cells[0]); // Simulate placing a queen on the first cell
    // Click on the Clear button
    const clearButton = screen.getByRole("button", { name: /Clear/i });
    fireEvent.click(clearButton);
    // Check if all cells are cleared (should not display queens)
    const clearedCells = screen.getAllByRole("cell");
    clearedCells.forEach((cell) => {
      expect(cell).not.toHaveTextContent("♛");
    });
  });

  it("renders the N-Queens puzzle with default board size", () => {
    render(<NQueenPuzzle />);
    // Check if the heading and description are rendered
    const headerElement = screen.getByText(/The N-Queens Puzzle/i);
    expect(headerElement).toBeInTheDocument();
    // Check if the default board size is set to 4
    const inputElement = screen.getByLabelText(/Board Size:/i);
    expect(inputElement).toHaveValue(4);
    // Expect there to be 16 cells (4x4 board) by default
    const cells = screen.getAllByRole("cell");
    expect(cells.length).toBe(16);
  });

  it("allows resizing the board", () => {
    render(<NQueenPuzzle />);
    // Resize the board to 5x5
    const inputElement = screen.getByLabelText(/Board Size:/i);
    fireEvent.change(inputElement, { target: { value: "5" } });
    // Check if the board is updated to 5x5 (25 cells)
    const cells = screen.getAllByRole("cell");
    expect(cells.length).toBe(25);
  });

  it("can not resize board to size 0", () => {
    render(<NQueenPuzzle />);
    // Attempt to resize to 0x0
    const inputElement = screen.getByLabelText(/Board Size:/i);
    fireEvent.change(inputElement, { target: { value: "0" } });
    // make sure the board is not 0x0 (0 cells)
    const cells = screen.getAllByRole("cell");
    expect(cells.length).not.toBe(0);
  });

  it("prevents board being smaller than 1x1", () => {
    render(<NQueenPuzzle />);
    // Attempt to resize to an invalid size (e.g., -1)
    const inputElement = screen.getByLabelText(/Board Size:/i);
    fireEvent.change(inputElement, { target: { value: "-1" } });
    // Check if the board size is set to the minimum value (1x1 = 1 cells)
    expect(inputElement).toHaveValue(1);
  });

  it("handles keyboard controls for solving the puzzle", () => {
    render(<NQueenPuzzle />);
    // Mock solver to return true (solution found)
    solveNQueens.mockReturnValue(true);
    // Press 's' key to solve the puzzle
    fireEvent.keyDown(document, { key: "s", code: "KeyS" });
    // Check if the "Solution found" message is displayed
    const solutionText = screen.getByText(/Solution found/i);
    expect(solutionText).toBeInTheDocument();
  });

  it("handles keyboard controls for clearing the board", () => {
    render(<NQueenPuzzle />);
    // Place a queen on the first cell
    const cells = screen.getAllByRole("cell");
    fireEvent.click(cells[0]);
    // Clear the board by pressing the 'Escape' key
    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
    // Expect all cells to be cleared (no queens displayed)
    const clearedCells = screen.getAllByRole("cell");
    clearedCells.forEach((cell) => {
      expect(cell).not.toHaveTextContent("♛");
    });
  });

  it("handles keyboard controls for resizing the board", () => {
    render(<NQueenPuzzle />);
    const inputElement = screen.getByLabelText(/Board Size:/i);
    // Expect initial board size to be 4
    expect(inputElement).toHaveValue(4);
    // Increase board size by pressing the 'ArrowUp' key
    fireEvent.keyDown(document, { key: "ArrowUp", code: "ArrowUp" });
    // Expect board size to be 5
    expect(inputElement).toHaveValue(5);
    // Decrease board size by pressing the 'ArrowDown' key
    fireEvent.keyDown(document, { key: "ArrowDown", code: "ArrowDown" });
    // Expect board size to be 4 again
    expect(inputElement).toHaveValue(4);
  });
});
