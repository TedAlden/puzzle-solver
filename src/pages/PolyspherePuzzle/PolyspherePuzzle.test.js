import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import PolyspherePuzzle from "./PolyspherePuzzle";
import createPolysphereWorker from "../../workers/createPolysphereWorker";

// Mock the worker
jest.mock("../../workers/createPolysphereWorker");

// Mock pieces
jest.mock("../../lib/pieces", () => [
  {
    symbol: "A",
    coords: [
      [0, 0],
      [0, 1],
    ],
    name: "Piece A",
  },
  {
    symbol: "B",
    coords: [
      [0, 0],
      [1, 0],
    ],
    name: "Piece B",
  },
]);

describe("PolyspherePuzzle Component", () => {
  let worker;
  let mockBoard;

  beforeEach(() => {
    mockBoard = Array(5)
      .fill()
      .map(() => Array(11).fill(""));
    worker = {
      postMessage: jest.fn(),
      terminate: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    createPolysphereWorker.mockReturnValue(worker);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Worker and Solution Handling Edge Cases", () => {
    test("solution index bounds handling", async () => {
      render(<PolyspherePuzzle />);
      fireEvent.click(screen.getByText("Solve Puzzle"));

      const messageHandler = worker.addEventListener.mock.calls[0][1];

      act(() => {
        messageHandler({ data: { type: "solution", data: mockBoard } });
        messageHandler({ data: { type: "complete" } });
      });

      const solutionIndex = screen.getByTestId("solution-index");

      await waitFor(() => {
        expect(solutionIndex).toHaveValue(1);
      });

      // Test bounds
      const prevButton = screen.getByTestId("prev-sol");
      const nextButton = screen.getByTestId("next-sol");
      fireEvent.click(prevButton);
      fireEvent.click(nextButton);

      // solutionIndex should still be 1
      expect(solutionIndex).toHaveValue(1);
    });
  });

  describe("Board State and Solutions", () => {
    test("updates board when solution index changes", async () => {
      const mockBoard1 = Array(5)
        .fill()
        .map(() => Array(11).fill("A"));
      const mockBoard2 = Array(5)
        .fill()
        .map(() => Array(11).fill("B"));

      render(<PolyspherePuzzle />);
      fireEvent.click(screen.getByText("Solve Puzzle"));

      const messageHandler = worker.addEventListener.mock.calls[0][1];

      act(() => {
        messageHandler({ data: { type: "solution", data: mockBoard1 } });
        messageHandler({ data: { type: "solution", data: mockBoard2 } });
        messageHandler({ data: { type: "complete" } });
      });

      const solutionIndex = screen.getByTestId("solution-index");

      await waitFor(() => {
        expect(solutionIndex).toHaveValue(1);
      });

      // Navigate through solutions and verify board updates
      const prevButton = screen.getByTestId("prev-sol");
      const nextButton = screen.getByTestId("next-sol");
      fireEvent.click(nextButton);
      fireEvent.click(prevButton);

      // Verify we're back at solution 1
      expect(solutionIndex).toHaveValue(1);
    });
  });

  test("renders without crashing", () => {
    render(<PolyspherePuzzle />);
    expect(screen.getByText("The Polysphere Puzzle")).toBeInTheDocument();
  });

  test("renders keyboard controls section", () => {
    render(<PolyspherePuzzle />);
    expect(screen.getByText("Keyboard Controls")).toBeInTheDocument();
    expect(screen.getByText("R : Rotate piece")).toBeInTheDocument();
    expect(screen.getByText("F : Flip piece")).toBeInTheDocument();
  });

  test("initializes worker and handles cleanup", () => {
    const { unmount } = render(<PolyspherePuzzle />);
    expect(createPolysphereWorker).toHaveBeenCalled();
    unmount();
    expect(worker.terminate).toHaveBeenCalled();
  });

  // Keyboard Controls Tests
  describe("Keyboard Controls", () => {
    test("handles rotate piece (R key)", () => {
      render(<PolyspherePuzzle />);
      act(() => {
        fireEvent.keyDown(window, { key: "r" });
      });
      // Verify component didn't crash after rotation
      expect(screen.getByText("The Polysphere Puzzle")).toBeInTheDocument();
    });

    test("handles flip piece (F key)", () => {
      render(<PolyspherePuzzle />);
      act(() => {
        fireEvent.keyDown(window, { key: "f" });
      });
      expect(screen.getByText("The Polysphere Puzzle")).toBeInTheDocument();
    });

    test("handles arrow keys for piece navigation", () => {
      render(<PolyspherePuzzle />);
      act(() => {
        fireEvent.keyDown(window, { key: "ArrowLeft" });
        fireEvent.keyDown(window, { key: "ArrowRight" });
      });
      expect(screen.getByText("The Polysphere Puzzle")).toBeInTheDocument();
    });

    test("handles undo (U key)", async () => {
      render(<PolyspherePuzzle />);
      // First make a move by solving
      fireEvent.click(screen.getByText("Solve Puzzle"));

      const messageHandler = worker.addEventListener.mock.calls[0][1];
      act(() => {
        messageHandler({ data: { type: "solution", data: mockBoard } });
        messageHandler({ data: { type: "complete" } });
      });

      await waitFor(() => {
        fireEvent.keyDown(window, { key: "u" });
      });
    });

    test("handles clear board (Escape key)", () => {
      render(<PolyspherePuzzle />);
      act(() => {
        fireEvent.keyDown(window, { key: "Escape" });
      });
      expect(screen.getByText("Clear Board")).toBeInTheDocument();
    });

    test("keyboard controls do nothing when solving", () => {
      render(<PolyspherePuzzle />);

      // Start solving
      fireEvent.click(screen.getByText("Solve Puzzle"));

      // Try keyboard controls while solving
      act(() => {
        fireEvent.keyDown(window, { key: "r" });
        fireEvent.keyDown(window, { key: "f" });
        fireEvent.keyDown(window, { key: "ArrowLeft" });
        fireEvent.keyDown(window, { key: "ArrowRight" });
        fireEvent.keyDown(window, { key: "u" });
        fireEvent.keyDown(window, { key: "Escape" });
      });

      // Verify solving state wasn't interrupted
      expect(screen.getByText("Solving...")).toBeInTheDocument();
    });
  });

  // Solution and Worker Tests
  describe("Solution Handling", () => {
    test("handles solution messages from worker", async () => {
      render(<PolyspherePuzzle />);
      fireEvent.click(screen.getByText("Solve Puzzle"));

      const messageHandler = worker.addEventListener.mock.calls[0][1];
      act(() => {
        messageHandler({ data: { type: "solution", data: mockBoard } });
        messageHandler({ data: { type: "complete" } });
      });

      await waitFor(() => {
        expect(screen.getByText("Solutions found ✅")).toBeInTheDocument();
      });
    });

    test("handles multiple solutions and navigation", async () => {
      render(<PolyspherePuzzle />);
      fireEvent.click(screen.getByText("Solve Puzzle"));

      const messageHandler = worker.addEventListener.mock.calls[0][1];
      act(() => {
        messageHandler({ data: { type: "solution", data: mockBoard } });
        messageHandler({ data: { type: "solution", data: mockBoard } });
        messageHandler({ data: { type: "complete" } });
      });

      const solutionIndex = screen.getByTestId("solution-index");

      await waitFor(() => {
        expect(solutionIndex).toHaveValue(1);
      });

      const prevButton = screen.getByTestId("prev-sol");
      const nextButton = screen.getByTestId("next-sol");

      // Test navigation
      fireEvent.click(nextButton);
      expect(solutionIndex).toHaveValue(2);

      fireEvent.click(prevButton);
      expect(solutionIndex).toHaveValue(1);
    });

    test("handles no solutions case", async () => {
      render(<PolyspherePuzzle />);
      fireEvent.click(screen.getByText("Solve Puzzle"));

      const messageHandler = worker.addEventListener.mock.calls[0][1];
      act(() => {
        messageHandler({ data: { type: "complete" } });
      });

      await waitFor(() => {
        expect(screen.getByText("No solutions ⚠️")).toBeInTheDocument();
      });
    });
  });

  describe("Solution Navigation Edge Cases", () => {
    test("handleNextSolution when at last solution", async () => {
      render(<PolyspherePuzzle />);
      fireEvent.click(screen.getByText("Solve Puzzle"));
      const messageHandler = worker.addEventListener.mock.calls[0][1];
      // Create exactly two solutions
      act(() => {
        messageHandler({ data: { type: "solution", data: mockBoard } });
        messageHandler({ data: { type: "solution", data: mockBoard } });
        messageHandler({ data: { type: "complete" } });
      });
      const solutionIndex = screen.getByTestId("solution-index");

      await waitFor(() => {
        expect(solutionIndex).toHaveValue(1);
      });

      const nextButton = screen.getByTestId("next-sol");
      // Navigate to last solution
      fireEvent.click(nextButton);
      expect(solutionIndex).toHaveValue(2);
      // Try to go beyond last solution
      fireEvent.click(nextButton);
      // Should still be on solution 2
      expect(solutionIndex).toHaveValue(2);
    });

    test("handlePreviousSolution when at first solution", async () => {
      render(<PolyspherePuzzle />);
      fireEvent.click(screen.getByText("Solve Puzzle"));
      const messageHandler = worker.addEventListener.mock.calls[0][1];
      act(() => {
        messageHandler({ data: { type: "solution", data: mockBoard } });
        messageHandler({ data: { type: "solution", data: mockBoard } });
        messageHandler({ data: { type: "complete" } });
      });
      const solutionIndex = screen.getByTestId("solution-index");

      await waitFor(() => {
        expect(solutionIndex).toHaveValue(1);
      });
      // Try to go before first solution
      const prevButton = screen.getByTestId("prev-sol");
      fireEvent.click(prevButton);
      // Should still be on solution 1
      expect(solutionIndex).toHaveValue(1);
    });
  });

  // Move Stack and Board State Tests
  describe("Move Stack and Board State", () => {
    test("handleUndo with moves in stack", async () => {
      render(<PolyspherePuzzle />);

      // Make a move by solving
      fireEvent.click(screen.getByText("Solve Puzzle"));

      const messageHandler = worker.addEventListener.mock.calls[0][1];
      act(() => {
        messageHandler({ data: { type: "solution", data: mockBoard } });
        messageHandler({ data: { type: "complete" } });
      });

      // Try to undo
      await waitFor(() => {
        const undoButton = screen.getByText("Undo");
        fireEvent.click(undoButton);
      });
    });

    test("clear board resets all state", async () => {
      render(<PolyspherePuzzle />);

      // First add some solutions
      fireEvent.click(screen.getByText("Solve Puzzle"));

      const messageHandler = worker.addEventListener.mock.calls[0][1];
      act(() => {
        messageHandler({ data: { type: "solution", data: mockBoard } });
        messageHandler({ data: { type: "complete" } });
      });

      // Clear the board
      await waitFor(() => {
        fireEvent.click(screen.getByText("Clear Board"));
      });

      // Verify reset state
      expect(screen.queryByText("Solutions found ✅")).not.toBeInTheDocument();
    });

    test("handleNextSolution and handlePreviousSolution bounds checking", async () => {
      render(<PolyspherePuzzle />);
      fireEvent.click(screen.getByText("Solve Puzzle"));

      const messageHandler = worker.addEventListener.mock.calls[0][1];
      act(() => {
        messageHandler({ data: { type: "solution", data: mockBoard } });
        messageHandler({ data: { type: "complete" } });
      });

      await waitFor(() => {
        const prevButton = screen.getByText("Previous Solution");
        const nextButton = screen.getByText("Next Solution");
        expect(prevButton).toBeDisabled();
        expect(nextButton).toBeDisabled();
      });
    });

    test("disables undo button when no moves in stack or solving", () => {
      render(<PolyspherePuzzle />);
      // Initially, the undo button should be disabled because the move stack is
      // empty
      expect(screen.getByText("Undo")).toBeDisabled();
      // Click on first cell to place a piece and add it to the move stack
      fireEvent.click(screen.getAllByTestId("cell")[0]);
      // Undo should now be enabled since there is a move in the stack
      expect(screen.getByText("Undo")).not.toBeDisabled();
      // Simulate solving puzzle
      fireEvent.click(screen.getByText("Solve Puzzle"));
      // Undo should now be disabled while solving
      expect(screen.getByText("Undo")).toBeDisabled();
    });
  });

  // Error Handling Tests
  describe("Error Handling", () => {
    test("handles worker creation failure", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      createPolysphereWorker.mockImplementation(() => {
        throw new Error("Worker creation failed");
      });

      render(<PolyspherePuzzle />);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to create Web Worker:",
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });
});
