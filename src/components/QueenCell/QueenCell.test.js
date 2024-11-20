import { render, screen, fireEvent } from "@testing-library/react";
import QueenCell from "./QueenCell";

describe("Board component", () => {
  it('should apply the "hovered" class when hovered over', () => {
    const onMouseClick = jest.fn();
    render(
      <QueenCell isEven={true} isQueen={false} onMouseClick={onMouseClick} />
    );

    const cell = screen.getByRole("cell");

    // Initially, the cell should not have the "hovered" class
    expect(cell.classList.contains("hovered")).toBe(false);

    // Trigger mouse enter to simulate hover
    fireEvent.mouseEnter(cell);
    expect(cell.classList.contains("hovered")).toBe(true);

    // Trigger mouse leave to end hover
    fireEvent.mouseLeave(cell);
    expect(cell.classList.contains("hovered")).toBe(false);
  });
});
