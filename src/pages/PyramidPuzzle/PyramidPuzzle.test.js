import { render, screen, fireEvent } from "@testing-library/react";
import PyramidPuzzle from "./PyramidPuzzle";
import usePyramidPuzzle from "../../hooks/usePyramidPuzzle";

// Mock the usePyramidPuzzle hook, so that we can control the return values and
// focus on testing the React UI, rather than the logic in the hook
jest.mock("../../hooks/usePyramidPuzzle");
// Mock the PyramidPieceSelector and PyramidBoard components since they use
// Three.js and there is an issue with Jest not being able to render them...
jest.mock(
  "../../components/PyramidPieceSelector/PyramidPieceSelector",
  () => () => <div>PyramidPieceSelector Mock</div>
);
jest.mock("../../components/PyramidBoard/PyramidBoard", () => () => (
  <div>PyramidBoard Mock</div>
));

describe("PyramidPuzzle", () => {
  // Mock the return values from the usePyramidPuzzle hook
  const mockUsePyramidPuzzle = {
    board: [],
    shapes: [],
    selectedShape: null,
    highlightedCells: [],
    moveStack: [],
    isSolved: false,
    isSolving: false,
    solutions: [],
    solutionIndex: 0,
    handleRotatePieceX: jest.fn(),
    handleRotatePieceY: jest.fn(),
    handleRotatePieceZ: jest.fn(),
    handleFlipPieceX: jest.fn(),
    handleFlipPieceY: jest.fn(),
    handleFlipPieceZ: jest.fn(),
    handleSolve: jest.fn(),
    handleClear: jest.fn(),
    handleSetSolutionIndex: jest.fn(),
    handleUndo: jest.fn(),
    handleMouseEnterCell: jest.fn(),
    handleMouseLeaveCell: jest.fn(),
    handleMouseClickCell: jest.fn(),
    handlePreviousPiece: jest.fn(),
    handleNextPiece: jest.fn(),
  };

  it("renders PyramidPuzzle component and mocks Three.js components", () => {
    usePyramidPuzzle.mockReturnValue(mockUsePyramidPuzzle);
    render(<PyramidPuzzle />);
    // Check that the PyramidPuzzle component renders (check title is present)
    expect(screen.getByText("The Pyramid Puzzle")).toBeInTheDocument();
    // Check that the PyramidPieceSelector and PyramidBoard components are
    // mocked, since they will cause big Jest errors otherwise
    expect(screen.getByText("PyramidPieceSelector Mock")).toBeInTheDocument();
    expect(screen.getByText("PyramidBoard Mock")).toBeInTheDocument();
  });

  it("calls handleSolve when Solve Puzzle button is clicked", () => {
    usePyramidPuzzle.mockReturnValue(mockUsePyramidPuzzle);
    render(<PyramidPuzzle />);
    fireEvent.click(screen.getByTestId("solve-button"));
    expect(mockUsePyramidPuzzle.handleSolve).toHaveBeenCalled();
  });

  it("calls handleClear when Clear Board button is clicked", () => {
    usePyramidPuzzle.mockReturnValue(mockUsePyramidPuzzle);
    render(<PyramidPuzzle />);
    fireEvent.click(screen.getByTestId("clear-button"));
    expect(mockUsePyramidPuzzle.handleClear).toHaveBeenCalled();
  });

  it("calls handleUndo when Undo button is clicked", () => {
    const newMockUsePyramidPuzzle = {
      ...mockUsePyramidPuzzle,
      moveStack: [[0]],
    };
    usePyramidPuzzle.mockReturnValue(newMockUsePyramidPuzzle);
    render(<PyramidPuzzle />);
    expect(screen.getByTestId("undo-button")).not.toBeDisabled();
    fireEvent.click(screen.getByTestId("undo-button"));
    expect(mockUsePyramidPuzzle.handleUndo).toHaveBeenCalled();
  });

  it("disables Undo button when moveStack is empty", () => {
    usePyramidPuzzle.mockReturnValue(mockUsePyramidPuzzle);
    render(<PyramidPuzzle />);
    expect(screen.getByTestId("undo-button")).toBeDisabled();
  });

  it("renders the SolutionNavigator when there are solutions", () => {
    const newMockUsePyramidPuzzle = {
      ...mockUsePyramidPuzzle,
      solutions: [[/* some solution data */ it]],
    };
    usePyramidPuzzle.mockReturnValue(newMockUsePyramidPuzzle);
    render(<PyramidPuzzle />);
    expect(screen.getByTestId("solution-navigation")).toBeInTheDocument();
  });

  it("disables Solve button and changes text when puzzle is solving", () => {
    const newMockUsePyramidPuzzle = {
      ...mockUsePyramidPuzzle,
      isSolving: true,
    };
    usePyramidPuzzle.mockReturnValue(newMockUsePyramidPuzzle);
    render(<PyramidPuzzle />);
    // Check that the button text changes to "Solving..."
    expect(screen.getByTestId("solve-button")).toHaveTextContent("Solving...");
    // Check that the button is disabled
    expect(screen.getByTestId("solve-button")).toBeDisabled();
  });

  it("shows 'Solving' text when puzzle is solving", () => {
    const newMockUsePyramidPuzzle = {
      ...mockUsePyramidPuzzle,
      isSolving: true,
    };
    usePyramidPuzzle.mockReturnValue(newMockUsePyramidPuzzle);
    render(<PyramidPuzzle />);
    expect(screen.getByText("Solving ⏳")).toBeInTheDocument();
  });

  it("shows 'Solutions found' when puzzle is solved with solutions", () => {
    const newMockUsePyramidPuzzle = {
      ...mockUsePyramidPuzzle,
      isSolved: true,
      solutions: [
        [
          /* some solution data */
        ],
      ],
    };
    usePyramidPuzzle.mockReturnValue(newMockUsePyramidPuzzle);
    render(<PyramidPuzzle />);
    expect(screen.getByText("Solutions found ✅")).toBeInTheDocument();
  });

  it("shows 'No solutions' when puzzle is solved with no solutions", () => {
    const newMockUsePyramidPuzzle = {
      ...mockUsePyramidPuzzle,
      isSolved: true,
      solutions: [],
    };
    usePyramidPuzzle.mockReturnValue(newMockUsePyramidPuzzle);
    render(<PyramidPuzzle />);
    expect(screen.getByText("No solutions ⚠️")).toBeInTheDocument();
  });
});
