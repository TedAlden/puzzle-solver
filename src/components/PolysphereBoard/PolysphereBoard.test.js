import { fireEvent, render, screen } from "@testing-library/react";
import PolysphereBoard from "./PolysphereBoard";
import { createBoard2D } from "../../lib/utils";

describe("PolyBoard Component test", () => {
  // Default props for testing
  const defaultProps = {
    board: createBoard2D(2, 2, ""),
    highlightedCells: [],
    handleMouseEnterCell: jest.fn(),
    handleMouseLeaveCell: jest.fn(),
    handleMouseClickCell: jest.fn(),
  };

  it("renders the board correctly", () => {
    render(<PolysphereBoard {...defaultProps} />);
    const cells = screen.getAllByTestId("cell");
    // Expect 4 cells to be rendered (2x2 board)
    expect(cells).toHaveLength(4);
  });

  it("handles mouse enter event", () => {
    render(<PolysphereBoard {...defaultProps} />);
    const cells = screen.getAllByTestId("cell");
    // Hover over the first cell
    fireEvent.mouseEnter(cells[0]);
    // Expect the handleMouseEnterCell function to be called with the correct
    // [row, col] coordinates
    expect(defaultProps.handleMouseEnterCell).toHaveBeenCalledWith(0, 0);
  });

  it("handles mouse leave event", () => {
    render(<PolysphereBoard {...defaultProps} />);
    const cells = screen.getAllByTestId("cell");
    // Unhover the first cell
    fireEvent.mouseLeave(cells[0]);
    // Expect the handleMouseLeaveCell function to be called with the correct
    // [row, col] coordinates
    expect(defaultProps.handleMouseLeaveCell).toHaveBeenCalledWith(0, 0);
  });

  it("handles mouse click event", () => {
    render(<PolysphereBoard {...defaultProps} />);
    const cells = screen.getAllByTestId("cell");
    // Click on the first cell
    fireEvent.click(cells[0]);
    // Expect the handleMouseClickCell function to be called with the correct
    // [row, col] coordinates
    expect(defaultProps.handleMouseClickCell).toHaveBeenCalledWith(0, 0);
  });

  it("highlights cells correctly", () => {
    // Highlight the first cell
    const props = {
      ...defaultProps,
      highlightedCells: [[0, 0]],
    };
    render(<PolysphereBoard {...props} />);
    const cells = screen.getAllByTestId("cell");
    // Expect the first cell to have the highlighted class
    expect(cells[0]).toHaveClass("highlighted");
  });
});
