import { render, fireEvent } from "@testing-library/react";
import PyramidLayerBoards from "./PyramidLayerBoards";

describe("PyramidLayerBoards Component", () => {
  const mockBoard = [
    [[""]], // Layer 1: 1x1
    [
      ["", ""],
      ["", ""],
    ], // Layer 2: 2x2
    [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ], // Layer 3: 3x3
    [
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
    ], // Layer 4: 4x4
    [
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ], // Layer 5: 5x5
  ];

  const mockHighlightedCells = [
    [1, 4, 1], // Layer 5: Row 1, Col 4
    [2, 4, 1], // Layer 5: Row 2, Col 4
    [1, 4, 2], // Layer 5: Row 1, Col 5
    [2, 4, 2], // Layer 5: Row 2, Col 5
  ];

  const mockHandleMouseEnter = jest.fn();
  const mockHandleMouseLeave = jest.fn();
  const mockHandleMouseClick = jest.fn();

  test("highlights the correct cells", () => {
    const { container } = render(
      <PyramidLayerBoards
        board={mockBoard}
        highlightedCells={mockHighlightedCells}
        handleMouseEnterCell={jest.fn()}
        handleMouseLeaveCell={jest.fn()}
        handleMouseClickCell={jest.fn()}
      />
    );

    // Check highlighted cells
    const highlightedCells = container.querySelectorAll(".highlighted");
    expect(highlightedCells.length).toBe(mockHighlightedCells.length);

    // Check if the highlighted cells match
    mockHighlightedCells.forEach(([x, y, z]) => {
      const highlightedCell = container.querySelector(
        `[data-index="${z}-${x}-${y}"]`
      );
      expect(highlightedCell).toHaveClass("highlighted");
    });
  });

  test("triggers mouse events correctly", () => {
    const { container } = render(
      <PyramidLayerBoards
        board={mockBoard}
        highlightedCells={mockHighlightedCells}
        handleMouseEnterCell={mockHandleMouseEnter}
        handleMouseLeaveCell={mockHandleMouseLeave}
        handleMouseClickCell={mockHandleMouseClick}
      />
    );

    // Target the first highlighted cell
    const highlightedCell = container.querySelector(".highlighted");

    if (!highlightedCell) throw new Error("No highlighted cells found");

    fireEvent.mouseEnter(highlightedCell);
    fireEvent.mouseLeave(highlightedCell);
    fireEvent.click(highlightedCell);

    expect(mockHandleMouseEnter).toHaveBeenCalled();
    expect(mockHandleMouseLeave).toHaveBeenCalled();
    expect(mockHandleMouseClick).toHaveBeenCalled();
  });
});
