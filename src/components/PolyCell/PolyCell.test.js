import { render, fireEvent } from "@testing-library/react";
import PolyCell from "./PolyCell";

describe("PolyCell", () => {
  it("Becomes highlighted when hovered over", () => {
    // Mock the onMouseEnter function to simulate the hover effect
    const handleMouseEnter = jest.fn();
    const { getByTestId } = render(
      <PolyCell
        onMouseEnter={handleMouseEnter}
        highlighted={1} // Set highlighted
        value="A"
      />
    );
    const cell = getByTestId("cell");
    // Simulate the mouse enter event
    fireEvent.mouseEnter(cell);
    // Check if the highlighted class is applied
    expect(cell).toHaveClass("highlighted");
    // Verify the onMouseEnter callback was called
    expect(handleMouseEnter).toHaveBeenCalled();
  });
});
