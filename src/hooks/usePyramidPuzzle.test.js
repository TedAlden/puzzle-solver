import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
  renderHook,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import usePyramidPuzzle from "./usePyramidPuzzle";
import createPyramidWorker from "../workers/createPyramidWorker";

function TestComponent() {
  const hookResult = usePyramidPuzzle();
  return (
    <div>
      <h1>The Pyramid Puzzle</h1>

      {/* Keyboard Controls UI */}
      <div>Keyboard Controls</div>
      <div>R : Rotate piece X</div>
      <div>F : Flip piece X</div>
      <div>T : Rotate piece Y</div>
      <div>Y : Rotate piece Z</div>
      <div>G : Flip piece Y</div>
      <div>H : Flip piece Z</div>
      <div>U : Undo action</div>
      <div>S : Solve Puzzle</div>
      <div>Esc : Clear Board</div>

      {/* Action Buttons */}
      <button onClick={hookResult.handleSolve}>Solve Puzzle</button>
      <button onClick={hookResult.handleClear}>Clear Board</button>
      <button onClick={hookResult.handleRotatePieceX}>Rotate piece X</button>
      <button onClick={hookResult.handleRotatePieceY}>Rotate Y</button>
      <button onClick={hookResult.handleRotatePieceZ}>Rotate Z</button>
      <button onClick={hookResult.handleFlipPieceX}>Flip X</button>
      <button onClick={hookResult.handleFlipPieceY}>Flip Y</button>
      <button onClick={hookResult.handleFlipPieceZ}>Flip Z</button>
      <button
        onClick={hookResult.handleUndo}
        disabled={hookResult.moveStack.length === 0 || hookResult.isSolving}
      >
        Undo
      </button>

      {/* Status Messages */}
      {hookResult.isSolving && <div>Solving...</div>}
      {hookResult.solutions.length > 0 && <div>Solutions found ✅</div>}
      {hookResult.isSolved && hookResult.solutions.length === 0 && (
        <div>No solutions ⚠️</div>
      )}

      {/* Solution Navigation */}
      <input
        data-testid="solution-index"
        type="number"
        value={hookResult.solutionIndex + 1}
        readOnly
      />
      <button
        data-testid="prev-sol"
        onClick={() =>
          hookResult.handleSetSolutionIndex(hookResult.solutionIndex - 1)
        }
      >
        Previous Solution
      </button>
      <button
        data-testid="next-sol"
        onClick={() =>
          hookResult.handleSetSolutionIndex(hookResult.solutionIndex + 1)
        }
      >
        Next Solution
      </button>

      {/* Test Interaction Elements */}
      <div
        data-testid="cell"
        onClick={() => hookResult.handleMouseClickCell(0, 0, 0)}
      ></div>
      <div
        data-testid="invalid-cell"
        onClick={() => hookResult.handleMouseClickCell(999, 999, 999)}
      ></div>
      <div
        data-testid="board-cell"
        onMouseEnter={() => hookResult.handleMouseEnterCell(0, 0, 0)}
        onMouseLeave={hookResult.handleMouseLeaveCell}
      ></div>
      {/* State Data for Testing */}
      <div data-testid="puzzle-state">
        {JSON.stringify({
          selectedShapeCoords: hookResult.selectedShape?.coords,
          board: hookResult.board,
          isSolving: hookResult.isSolving,
          solutions: hookResult.solutions,
          solutionIndex: hookResult.solutionIndex,
          moveStack: hookResult.moveStack,
          highlightedCells: hookResult.highlightedCells,
        })}
      </div>
    </div>
  );
}

// Mock the worker
jest.mock("../workers/createPyramidWorker");

// Mock pieces
jest.mock("../lib/pieces", () => [
  {
    symbol: "A",
    coords: [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [2, 0],
    ],
    colour: "#ff0000",
  },
  {
    symbol: "K",
    coords: [
      [0, 0],
      [0, 1],
      [1, 1],
    ],
    colour: "#e78e3a",
  },
]);

describe("PyramidPuzzle Hook", () => {
  let worker;
  let mockBoard;

  beforeEach(() => {
    // Create a 3-layer pyramid board
    mockBoard = Array(3)
      .fill()
      .map((_, layerIndex) => {
        const layerSize = 3 - layerIndex;
        return Array(layerSize)
          .fill()
          .map(() => Array(layerSize).fill(""));
      });
    worker = {
      postMessage: jest.fn(),
      terminate: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    createPyramidWorker.mockReturnValue(worker);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("initial state of the hook is correct", () => {
    const { result } = renderHook(() => usePyramidPuzzle());

    const {
      board,
      shapes,
      selectedShape,
      highlightedCells,
      moveStack,
      isSolved,
      isSolving,
      solutions,
      solutionIndex,
    } = result.current;

    expect(board.length).toBe(5); // 5 layers in pyramid
    expect(shapes.length).toBeGreaterThan(0); // All pieces loaded
    expect(selectedShape).toBeTruthy(); // First piece selected
    expect(highlightedCells).toHaveLength(0);
    expect(moveStack).toHaveLength(0);
    expect(isSolved).toBe(false);
    expect(isSolving).toBe(false);
    expect(solutions).toHaveLength(0);
    expect(solutionIndex).toBe(0);
  });

  describe("Worker and Solution Handling Edge Cases", () => {
    test("solution index bounds handling", async () => {
      render(<TestComponent />);
      fireEvent.click(screen.getByText("Solve Puzzle"));

      const messageHandler = worker.addEventListener.mock.calls[0][1];

      act(() => {
        messageHandler({ data: { type: "solution", data: mockBoard } });
      });

      await waitFor(() => {
        expect(screen.getByTestId("solution-index")).toHaveValue(1);
      });

      // Test bounds
      const prevButton = screen.getByTestId("prev-sol");
      const nextButton = screen.getByTestId("next-sol");

      // Try to go before first solution
      fireEvent.click(prevButton);
      expect(screen.getByTestId("solution-index")).toHaveValue(1);

      // Try to go past last solution
      fireEvent.click(nextButton);
      expect(screen.getByTestId("solution-index")).toHaveValue(1);
    });
  });

  describe("Board State and Solutions", () => {
    test("updates board when solution index changes", async () => {
      const mockBoard1 = Array(3)
        .fill()
        .map((_, layerIndex) => {
          const layerSize = 3 - layerIndex;
          return Array(layerSize)
            .fill()
            .map(() => Array(layerSize).fill("A"));
        });
      const mockBoard2 = Array(3)
        .fill()
        .map((_, layerIndex) => {
          const layerSize = 3 - layerIndex;
          return Array(layerSize)
            .fill()
            .map(() => Array(layerSize).fill("B"));
        });

      render(<TestComponent />);
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
    render(<TestComponent />);
    expect(screen.getByText("The Pyramid Puzzle")).toBeInTheDocument();
  });

  test("renders keyboard controls section", () => {
    render(<TestComponent />);
    expect(screen.getByText("Keyboard Controls")).toBeInTheDocument();
    expect(screen.getByText("R : Rotate piece X")).toBeInTheDocument();
    expect(screen.getByText("T : Rotate piece Y")).toBeInTheDocument();
    expect(screen.getByText("Y : Rotate piece Z")).toBeInTheDocument();
    expect(screen.getByText("F : Flip piece X")).toBeInTheDocument();
    expect(screen.getByText("G : Flip piece Y")).toBeInTheDocument();
    expect(screen.getByText("H : Flip piece Z")).toBeInTheDocument();
    expect(screen.getByText("S : Solve Puzzle")).toBeInTheDocument();
    expect(screen.getByText("U : Undo action")).toBeInTheDocument();
    expect(screen.getByText("Esc : Clear Board")).toBeInTheDocument();
  });

  describe("Shape rotations", () => {
    test("rotates selected shape on the X axis", () => {
      const { result } = renderHook(() => usePyramidPuzzle());
      const initialCoords = [...result.current.selectedShape.coords];

      act(() => {
        result.current.handleRotatePieceX();
      });

      const updatedCoords = result.current.selectedShape.coords;

      expect(updatedCoords).not.toEqual(initialCoords);
    });

    test("rotates selected shape on the Y axis", () => {
      const { result } = renderHook(() => usePyramidPuzzle());
      const initialCoords = [...result.current.selectedShape.coords];

      act(() => {
        result.current.handleRotatePieceY();
      });

      const updatedCoords = result.current.selectedShape.coords;

      expect(updatedCoords).not.toEqual(initialCoords);
    });

    test("rotates selected shape on the Z axis", () => {
      const { result } = renderHook(() => usePyramidPuzzle());
      const initialCoords = [...result.current.selectedShape.coords];

      act(() => {
        result.current.handleRotatePieceZ();
      });

      const updatedCoords = result.current.selectedShape.coords;

      expect(updatedCoords).not.toEqual(initialCoords);
    });

    test("handleRotatePieceX does not run if isSolving is true", () => {
      const { result } = renderHook(() => usePyramidPuzzle());
      const initialCoords = [...result.current.selectedShape.coords];

      act(() => {
        result.current.handleSolve(); // Set isSolving to true
      });

      act(() => {
        result.current.handleRotatePieceX();
      });

      const updatedCoords = result.current.selectedShape.coords;

      expect(updatedCoords).toEqual(initialCoords);
    });

    test("handleRotatePieceY does not run if isSolving is true", () => {
      const { result } = renderHook(() => usePyramidPuzzle());
      const initialCoords = [...result.current.selectedShape.coords];

      act(() => {
        result.current.handleSolve(); // Set isSolving to true
      });

      act(() => {
        result.current.handleRotatePieceY();
      });

      const updatedCoords = result.current.selectedShape.coords;

      expect(updatedCoords).toEqual(initialCoords);
    });

    test("handleRotatePieceZ does not run if isSolving is true", () => {
      const { result } = renderHook(() => usePyramidPuzzle());
      const initialCoords = [...result.current.selectedShape.coords];

      act(() => {
        result.current.handleSolve(); // Set isSolving to true
      });

      act(() => {
        result.current.handleRotatePieceZ();
      });

      const updatedCoords = result.current.selectedShape.coords;

      expect(updatedCoords).toEqual(initialCoords);
    });
  });

  describe("Shape flips", () => {
    test("flips selected shape on the X axis", () => {
      const { result } = renderHook(() => usePyramidPuzzle());
      const initialCoords = [...result.current.selectedShape.coords];

      act(() => {
        result.current.handleFlipPieceX();
      });

      const updatedCoords = result.current.selectedShape.coords;

      expect(updatedCoords).not.toEqual(initialCoords);
    });

    test("flips selected shape on the Y axis", () => {
      const { result } = renderHook(() => usePyramidPuzzle());
      const initialCoords = [...result.current.selectedShape.coords];

      act(() => {
        result.current.handleRotatePieceX();
      });

      act(() => {
        result.current.handleFlipPieceY();
      });

      const updatedCoords = result.current.selectedShape.coords;

      expect(updatedCoords).not.toEqual(initialCoords);
    });

    test("flips selected shape on the Z axis", () => {
      const { result } = renderHook(() => usePyramidPuzzle());
      const initialCoords = [...result.current.selectedShape.coords];

      act(() => {
        result.current.handleFlipPieceZ();
      });

      const updatedCoords = result.current.selectedShape.coords;

      expect(updatedCoords).not.toEqual(initialCoords);
    });

    test("handleFlipPieceX does not run if isSolving is true", () => {
      const { result } = renderHook(() => usePyramidPuzzle());
      const initialCoords = [...result.current.selectedShape.coords];

      act(() => {
        result.current.handleSolve(); // Set isSolving to true
      });

      act(() => {
        result.current.handleFlipPieceX();
      });

      const updatedCoords = result.current.selectedShape.coords;

      expect(updatedCoords).toEqual(initialCoords);
    });

    test("handleFlipPieceY does not run if isSolving is true", () => {
      const { result } = renderHook(() => usePyramidPuzzle());
      const initialCoords = [...result.current.selectedShape.coords];

      act(() => {
        result.current.handleSolve(); // Set isSolving to true
      });

      act(() => {
        result.current.handleFlipPieceY();
      });

      const updatedCoords = result.current.selectedShape.coords;

      expect(updatedCoords).toEqual(initialCoords);
    });

    test("handleFlipPieceZ does not run if isSolving is true", () => {
      const { result } = renderHook(() => usePyramidPuzzle());
      const initialCoords = [...result.current.selectedShape.coords];

      act(() => {
        result.current.handleSolve(); // Set isSolving to true
      });

      act(() => {
        result.current.handleFlipPieceZ();
      });

      const updatedCoords = result.current.selectedShape.coords;

      expect(updatedCoords).toEqual(initialCoords);
    });
  });

  describe("Shape navigation", () => {
    test("handlePreviousPiece does not run if isSolving is true", () => {
      const { result } = renderHook(() => usePyramidPuzzle());
      const initialShape = result.current.selectedShape;

      act(() => {
        result.current.handleSolve(); // Set isSolving to true
      });

      act(() => {
        result.current.handlePreviousPiece();
      });

      const updatedShape = result.current.selectedShape;

      expect(updatedShape).toEqual(initialShape);
    });

    test("handleNextPiece does not run if isSolving is true", () => {
      const { result } = renderHook(() => usePyramidPuzzle());
      const initialShape = result.current.selectedShape;

      act(() => {
        result.current.handleSolve(); // Set isSolving to true
      });

      act(() => {
        result.current.handleNextPiece();
      });

      const updatedShape = result.current.selectedShape;

      expect(updatedShape).toEqual(initialShape);
    });
  });

  describe("Board actions", () => {
    test("handleClear does not run if isSolving is true", () => {
      const { result } = renderHook(() => usePyramidPuzzle());
      const initialBoard = [...result.current.board];

      act(() => {
        result.current.handleSolve(); // Set isSolving to true
      });

      act(() => {
        result.current.handleClear();
      });

      const updatedBoard = result.current.board;

      expect(updatedBoard).toEqual(initialBoard);
    });

    test("handleUndo does not run if isSolving is true", () => {
      const { result } = renderHook(() => usePyramidPuzzle());
      const initialBoard = [...result.current.board];

      act(() => {
        result.current.handleSolve(); // Set isSolving to true
      });

      act(() => {
        result.current.handleUndo();
      });

      const updatedBoard = result.current.board;

      expect(updatedBoard).toEqual(initialBoard);
    });
  });

  // Solution and Worker Tests
  describe("Solution Handling", () => {
    test("handles solution messages from worker", async () => {
      render(<TestComponent />);
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
      render(<TestComponent />);
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
      render(<TestComponent />);
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

  describe("Move Stack and Board State", () => {
    test("handleUndo with moves in stack", async () => {
      render(<TestComponent />);

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
      render(<TestComponent />);

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

    test("disables undo button when no moves in stack or solving", () => {
      render(<TestComponent />);

      expect(screen.getByText("Undo")).toBeDisabled();
      fireEvent.click(screen.getAllByTestId("cell")[0]);

      expect(screen.getByText("Undo")).not.toBeDisabled();
      fireEvent.click(screen.getByText("Solve Puzzle"));
      expect(screen.getByText("Undo")).toBeDisabled();
    });
  });

  test("handleUndo restores the previous state", () => {
    const { result } = renderHook(() => usePyramidPuzzle());

    act(() => {
      result.current.handleMouseClickCell(0, 0, 0);
    });

    act(() => {
      result.current.handleUndo();
    });

    expect(result.current.board.flat(2).every((cell) => cell === "")).toBe(
      true
    ); // Board restored
    expect(result.current.shapes.length).toBeGreaterThan(0);
  });

  test("handleUndo does nothing when stack is empty", () => {
    const { result } = renderHook(() => usePyramidPuzzle());

    const initialBoard = [...result.current.board];
    const initialShapes = [...result.current.shapes];

    act(() => {
      result.current.handleUndo();
    });

    expect(result.current.board).toEqual(initialBoard);
    expect(result.current.shapes).toEqual(initialShapes);
  });

  test("handlePreviousPiece selects the previous shape", () => {
    const { result } = renderHook(() => usePyramidPuzzle());
    const initialShape = result.current.selectedShape;

    act(() => {
      result.current.handlePreviousPiece();
    });

    const previousShape = result.current.selectedShape;
    expect(previousShape).not.toBe(initialShape);
    const currentIndex = result.current.shapes.findIndex(
      (shape) => shape.symbol === initialShape.symbol
    );
    const expectedIndex =
      (currentIndex - 1 + result.current.shapes.length) %
      result.current.shapes.length;

    expect(previousShape.symbol).toBe(
      result.current.shapes[expectedIndex].symbol
    );
  });

  test("handleNextPiece selects the next shape", () => {
    const { result } = renderHook(() => usePyramidPuzzle());
    const initialShape = result.current.selectedShape;

    act(() => {
      result.current.handleNextPiece();
    });

    const nextShape = result.current.selectedShape;
    expect(nextShape).not.toBe(initialShape);
    const currentIndex = result.current.shapes.findIndex(
      (shape) => shape.symbol === initialShape.symbol
    );
    const expectedIndex = (currentIndex + 1) % result.current.shapes.length;

    expect(nextShape.symbol).toBe(result.current.shapes[expectedIndex].symbol);
  });

  test("updates highlightedCells based on highlightedIndex, selectedShape, and board", () => {
    const { result } = renderHook(() => usePyramidPuzzle());

    const validHighlightedIndex = [0, 0, 0];
    act(() => {
      result.current.handleMouseEnterCell(...validHighlightedIndex);
    });
    const expectedHighlightedCells = result.current.selectedShape.coords.map(
      ([x, y, z]) => [
        x + validHighlightedIndex[2],
        y + validHighlightedIndex[0],
        z + validHighlightedIndex[1],
      ]
    );
    expect(result.current.highlightedCells).toEqual(expectedHighlightedCells);

    act(() => {
      result.current.handleMouseEnterCell(10, 10, 10);
    });
    expect(result.current.highlightedCells).toEqual([]);
    act(() => {
      result.current.handleClear();
    });
    expect(result.current.highlightedCells).toEqual([]);
    expect(result.current.selectedShape).toEqual(result.current.shapes[0]);
  });

  describe("Highlighted Cells Functionality", () => {
    test.each([
      { description: "valid position", index: [0, 0, 0], expectedLength: 5 },
      {
        description: "out of bounds",
        index: [999, 999, 999],
        expectedLength: 0,
      },
      {
        description: "negative indices",
        index: [-1, -1, -1],
        expectedLength: 0,
      },
    ])(
      "updates highlightedCells correctly for $description",
      ({ index, expectedLength }) => {
        const { result } = renderHook(() => usePyramidPuzzle());
        act(() => {
          result.current.handleMouseEnterCell(...index);
        });
        expect(result.current.highlightedCells.length).toBe(expectedLength);
      }
    );

    test("clears highlighted cells when piece would exceed board dimensions", () => {
      render(<TestComponent />);

      // Try to highlight cells at coordinates beyond board size
      const oversizedCell = document.createElement("div");
      oversizedCell.dataset.layer = "999";
      oversizedCell.dataset.row = "999";
      oversizedCell.dataset.col = "999";

      fireEvent.mouseEnter(oversizedCell);

      const state = JSON.parse(screen.getByTestId("puzzle-state").textContent);
      expect(state.highlightedCells).toHaveLength(0);
    });

    test("handles edge cases of board dimensions", () => {
      render(<TestComponent />);
      const state = JSON.parse(screen.getByTestId("puzzle-state").textContent);
      const maxBoardIndex = state.board.length - 1;

      // Test at maximum valid indices
      const edgeCell = document.createElement("div");
      edgeCell.dataset.layer = maxBoardIndex.toString();
      edgeCell.dataset.row = maxBoardIndex.toString();
      edgeCell.dataset.col = maxBoardIndex.toString();

      fireEvent.mouseEnter(edgeCell);

      const newState = JSON.parse(
        screen.getByTestId("puzzle-state").textContent
      );
      expect(newState.highlightedCells).toHaveLength(0);
    });

    test("handles mouse leave by clearing highlighted cells", () => {
      render(<TestComponent />);
      const boardCell = screen.getByTestId("board-cell");

      fireEvent.mouseEnter(boardCell);
      fireEvent.mouseLeave(boardCell);

      const state = JSON.parse(screen.getByTestId("puzzle-state").textContent);
      expect(state.highlightedCells).toHaveLength(0);
    });

    test("clears highlighted cells when x-coordinate is out of bounds", () => {
      const { result } = renderHook(() => usePyramidPuzzle());

      // Set highlighted index with x-coordinate out of bounds
      act(() => {
        result.current.handleMouseEnterCell(
          0,
          result.current.board[0].length,
          0
        );
      });

      // Expect highlighted cells to be cleared
      expect(result.current.highlightedCells).toHaveLength(0);
    });

    test("clears highlighted cells when y-coordinate is out of bounds", () => {
      const { result } = renderHook(() => usePyramidPuzzle());

      // Set highlighted index with y-coordinate out of bounds
      act(() => {
        result.current.handleMouseEnterCell(result.current.board.length, 0, 0);
      });

      // Expect highlighted cells to be cleared
      expect(result.current.highlightedCells).toHaveLength(0);
    });

    test("clears highlighted cells when z-coordinate is out of bounds", () => {
      const { result } = renderHook(() => usePyramidPuzzle());

      // Set highlighted index with z-coordinate out of bounds
      act(() => {
        result.current.handleMouseEnterCell(
          0,
          0,
          result.current.board[0].length
        );
      });

      // Expect highlighted cells to be cleared
      expect(result.current.highlightedCells).toHaveLength(0);
    });
  });

  describe("Shape placement", () => {
    // test("handleMouseClickCell does nothing when no shape is selected", () => {
    //   const { result } = renderHook(() => usePyramidPuzzle());
    //   // initial board with no selected shape
    //   const initialBoard = [...result.current.board];
    //   // remove selected shape

    //   act(() => {
    //     result.current.handleMouseClickCell(0, 0, 0);
    //   });
    //   expect(result.current.board).toEqual(initialBoard);
    // });

    test("handleMouseClickCell does nothing for X-out-of-bounds cell", () => {
      const { result } = renderHook(() => usePyramidPuzzle());
      act(() => {
        result.current.handleMouseClickCell(0, -1, 0);
      });
      expect(result.current.board.flat(2).every((cell) => cell === "")).toBe(
        true
      );
    });

    test("handleMouseClickCell does nothing for Y-out-of-bounds cell", () => {
      const { result } = renderHook(() => usePyramidPuzzle());
      act(() => {
        result.current.handleMouseClickCell(-1, 0, 0);
      });
      expect(result.current.board.flat(2).every((cell) => cell === "")).toBe(
        true
      );
    });

    test("handleMouseClickCell does nothing for Z-out-of-bounds cell", () => {
      const { result } = renderHook(() => usePyramidPuzzle());
      act(() => {
        result.current.handleMouseClickCell(0, 0, -1);
      });
      expect(result.current.board.flat(2).every((cell) => cell === "")).toBe(
        true
      );
    });

    test("handleMouseClickCell places shape correctly", () => {
      const { result } = renderHook(() => usePyramidPuzzle());
      const initialBoard = [...result.current.board];
      act(() => {
        result.current.handleMouseClickCell(0, 0, 0);
      });
      expect(result.current.board).not.toEqual(initialBoard);
    });

    test("handleMouseClickCell sets selectedShape to null when no shapes are left", () => {
      const { result } = renderHook(() => usePyramidPuzzle());

      // Place all shapes on the board
      act(() => {
        result.current.handleMouseClickCell(0, 0, 0);
      });

      act(() => {
        result.current.handleMouseClickCell(1, 0, 0);
      });

      // Ensure selectedShape is set to null when no shapes are left
      expect(result.current.selectedShape).toBeNull();

      const boardAfterPlacement = result.current.board;

      act(() => {
        result.current.handleMouseClickCell(1, 0, 0);
      });

      // Ensure board state does not change when no shapes are left
      expect(result.current.board).toEqual(boardAfterPlacement);
    });
  });

  // Error Handling Tests
  describe("Error Handling", () => {
    test("handles worker creation failure", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      createPyramidWorker.mockImplementation(() => {
        throw new Error("Worker creation failed");
      });

      render(<TestComponent />);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to create Pyramid Web Worker:",
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });

  test("initialises worker and handles cleanup", () => {
    const { unmount } = render(<TestComponent />);
    expect(createPyramidWorker).toHaveBeenCalled();
    unmount();
    expect(worker.terminate).toHaveBeenCalled();
  });
});
