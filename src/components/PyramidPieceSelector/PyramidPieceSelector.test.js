import { render, fireEvent, screen } from "@testing-library/react";
import PyramidPieceSelector from "./PyramidPieceSelector";

jest.mock("./PiecePreview", () => () => (
  <div data-testid="mock-piece-preview-3d" />
));

describe("PyramidPieceSelector", () => {
  const mockShape = {
    coords: [
      [0, 0, 0],
      [1, 0, 0],
      [0, 1, 0],
    ],
    colour: "#ff0000",
  };
  const mockFunctions = {
    onFlipX: jest.fn(),
    onFlipY: jest.fn(),
    onFlipZ: jest.fn(),
    onRotateX: jest.fn(),
    onRotateY: jest.fn(),
    onRotateZ: jest.fn(),
    onPrevious: jest.fn(),
    onNext: jest.fn(),
  };

  it("renders without crashing", () => {
    render(
      <PyramidPieceSelector selectedShape={mockShape} {...mockFunctions} />
    );
  });

  it("calls onPrevious when Prev button is clicked", () => {
    render(
      <PyramidPieceSelector selectedShape={mockShape} {...mockFunctions} />
    );
    fireEvent.click(screen.getByText("Prev"));
    expect(mockFunctions.onPrevious).toHaveBeenCalled();
  });

  it("calls onNext when Next button is clicked", () => {
    render(
      <PyramidPieceSelector selectedShape={mockShape} {...mockFunctions} />
    );
    fireEvent.click(screen.getByText("Next"));
    expect(mockFunctions.onNext).toHaveBeenCalled();
  });

  it("calls onFlipX when Flip X button is clicked", () => {
    render(
      <PyramidPieceSelector selectedShape={mockShape} {...mockFunctions} />
    );
    fireEvent.click(screen.getByText("Flip X"));
    expect(mockFunctions.onFlipX).toHaveBeenCalled();
  });

  it("calls onFlipY when Flip Y button is clicked", () => {
    render(
      <PyramidPieceSelector selectedShape={mockShape} {...mockFunctions} />
    );
    fireEvent.click(screen.getByText("Flip Y"));
    expect(mockFunctions.onFlipY).toHaveBeenCalled();
  });

  it("calls onFlipZ when Flip Z button is clicked", () => {
    render(
      <PyramidPieceSelector selectedShape={mockShape} {...mockFunctions} />
    );
    fireEvent.click(screen.getByText("Flip Z"));
    expect(mockFunctions.onFlipZ).toHaveBeenCalled();
  });

  it("calls onRotateX when Rotate X button is clicked", () => {
    render(
      <PyramidPieceSelector selectedShape={mockShape} {...mockFunctions} />
    );
    fireEvent.click(screen.getByText("Rotate X"));
    expect(mockFunctions.onRotateX).toHaveBeenCalled();
  });

  it("calls onRotateY when Rotate Y button is clicked", () => {
    render(
      <PyramidPieceSelector selectedShape={mockShape} {...mockFunctions} />
    );
    fireEvent.click(screen.getByText("Rotate Y"));
    expect(mockFunctions.onRotateY).toHaveBeenCalled();
  });

  it("calls onRotateZ when Rotate Z button is clicked", () => {
    render(
      <PyramidPieceSelector selectedShape={mockShape} {...mockFunctions} />
    );
    fireEvent.click(screen.getByText("Rotate Z"));
    expect(mockFunctions.onRotateZ).toHaveBeenCalled();
  });
});
