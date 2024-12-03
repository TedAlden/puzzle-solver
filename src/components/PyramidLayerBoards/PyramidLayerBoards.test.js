import PyramidLayerBoards from "./PyramidLayerBoards";
import { render, screen, fireEvent } from "@testing-library/react";

describe("PyramidLayerBoards", () => {
  const board = [
    [["A"]],
    [
      ["B", ""],
      ["", "C"],
    ],
    [
      ["D", "", ""],
      ["", "E", ""],
      ["", "", "F"],
    ],
  ];
  const highlightedCells = [
    [0, 0, 0],
    [1, 1, 1],
  ];
  const handleMouseEnterCell = jest.fn();
  const handleMouseLeaveCell = jest.fn();
  const handleMouseClickCell = jest.fn();

  it("renders correctly", () => {
    const { container } = render(
      <PyramidLayerBoards
        board={board}
        highlightedCells={highlightedCells}
        handleMouseEnterCell={handleMouseEnterCell}
        handleMouseLeaveCell={handleMouseLeaveCell}
        handleMouseClickCell={handleMouseClickCell}
      />
    );
    expect(container.firstChild).toHaveClass("layer-boards-container");
  });

  it("handles mouse enter event", () => {
    render(
      <PyramidLayerBoards
        board={board}
        highlightedCells={highlightedCells}
        handleMouseEnterCell={handleMouseEnterCell}
        handleMouseLeaveCell={handleMouseLeaveCell}
        handleMouseClickCell={handleMouseClickCell}
      />
    );
    const cells = screen.getAllByRole("cell");
    fireEvent.mouseEnter(cells[0]);
    expect(handleMouseEnterCell).toHaveBeenCalled();
  });

  it("handles mouse leave event", () => {
    render(
      <PyramidLayerBoards
        board={board}
        highlightedCells={highlightedCells}
        handleMouseEnterCell={handleMouseEnterCell}
        handleMouseLeaveCell={handleMouseLeaveCell}
        handleMouseClickCell={handleMouseClickCell}
      />
    );
    const cells = screen.getAllByRole("cell");
    fireEvent.mouseLeave(cells[0]);
    expect(handleMouseLeaveCell).toHaveBeenCalled();
  });

  it("handles mouse click event", () => {
    render(
      <PyramidLayerBoards
        board={board}
        highlightedCells={highlightedCells}
        handleMouseEnterCell={handleMouseEnterCell}
        handleMouseLeaveCell={handleMouseLeaveCell}
        handleMouseClickCell={handleMouseClickCell}
      />
    );
    const cells = screen.getAllByRole("cell");
    fireEvent.click(cells[0]);
    expect(handleMouseClickCell).toHaveBeenCalled();
  });
});
