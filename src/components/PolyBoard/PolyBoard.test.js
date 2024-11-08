import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PolyBoard from "./PolyBoard";

describe("PolyBoard Component test", () => {
  const createEmptyBoard = (rows, cols) =>
    Array(rows)
      .fill()
      .map(() => Array(cols).fill(""));
  const mockBoard = createEmptyBoard(10, 10);
  const defaultProps = {
    shapes: [
      {
        //single cell
        symbol: "shape1",
        coords: [[0, 0]],
      },
      {
        //2*2 area
        symbol: "shape2",
        coords: [
          [0, 0],
          [1, 0],
          [0, 1],
          [1, 1],
        ],
      },
    ],
    setShapes: jest.fn(),
    selectedShape: {
      symbol: "shape1",
      coords: [[0, 0]],
    },
    setSelectedShape: jest.fn(),
    board: mockBoard,
    setBoard: jest.fn(),
    addMove: jest.fn(),
    isSolving: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Cell Component", () => {
    it("should render all cells correctly", () => {
      const { getAllByTestId } = render(<PolyBoard {...defaultProps} />);
      const cells = getAllByTestId("cell");
      expect(cells).toHaveLength(100);
      expect(cells[0]).toHaveClass("polyboard-cell");
    });

    it("should render cells with correct values", () => {
      const modifiedBoard = [...mockBoard];
      modifiedBoard[0] = [...mockBoard[0]];
      modifiedBoard[0][0] = "shape1"; // shape1 in first cell

      const props = {
        ...defaultProps,
        board: modifiedBoard,
      };

      const { getAllByTestId } = render(<PolyBoard {...props} />);
      const cells = getAllByTestId("cell");
      expect(cells[0]).toHaveClass("polyboard-cell", "shape1");
    });
  });

  describe("Mouse Event Handling", () => {
    it("should highlight cells on mouse enter with valid shape", () => {
      const { getAllByTestId } = render(<PolyBoard {...defaultProps} />);
      const cells = getAllByTestId("cell");

      fireEvent.mouseEnter(cells[0]);
      expect(cells[0]).toHaveClass("highlighted");
    });

    it("should do nothing when handleMouseClickCell is called and no shape is selected", () => {
      const props = {
        ...defaultProps,
        isSolving: true,
      };

      const { getAllByTestId } = render(<PolyBoard {...props} />);
      const cells = getAllByTestId("cell");

      fireEvent.click(cells[0]);
      expect(props.setBoard).not.toHaveBeenCalled();
    });

    // Updated test for no highlight when no shape is selected
    it("should not highlight when no shape is selected", () => {
      const props = {
        ...defaultProps,
        selectedShape: null, // No shape selected
      };

      const { getAllByTestId } = render(<PolyBoard {...props} />);
      const cells = getAllByTestId("cell");

      fireEvent.mouseEnter(cells[0]);

      // The cell should not be highlighted as no shape is selected
      expect(cells[0]).not.toHaveClass("highlighted");
    });

    it("should remove highlights on mouse leave", () => {
      const { getAllByTestId } = render(<PolyBoard {...defaultProps} />);
      const cells = getAllByTestId("cell");

      fireEvent.mouseEnter(cells[0]);
      expect(cells[0]).toHaveClass("highlighted");

      fireEvent.mouseLeave(cells[0]);
      expect(cells[0]).not.toHaveClass("highlighted");
    });

    it("should not clear highlights if isSolving is true", () => {
      const props = {
        ...defaultProps,
        isSolving: true, // Set isSolving to true to test this condition
      };

      const { getAllByTestId } = render(<PolyBoard {...props} />);
      const cells = getAllByTestId("cell");

      // Simulate mouse enter to attempt highlighting
      fireEvent.mouseEnter(cells[0]);
      expect(cells[0]).not.toHaveClass("highlighted");

      // Simulate mouse leave to see if highlights are cleared or not
      fireEvent.mouseLeave(cells[0]);
      // Confirm that the highlighted state hasn't changed as isSolving is true
      expect(cells[0]).not.toHaveClass("highlighted");
    });

    it("should not highlight out-of-bounds positions", () => {
      const bigShape = {
        ...defaultProps,
        selectedShape: {
          symbol: "big",
          coords: [
            [0, 0],
            [0, 9],
            [0, 10],
          ], // Extends beyond board
        },
      };

      const { getAllByTestId } = render(<PolyBoard {...bigShape} />);
      const cells = getAllByTestId("cell");

      fireEvent.mouseEnter(cells[90]); // Bottom edge
      expect(cells[90]).not.toHaveClass("highlighted");
    });
  });

  describe("Shape Placement", () => {
    it("should place shape in valid empty position", () => {
      const { getAllByTestId } = render(<PolyBoard {...defaultProps} />);
      const cells = getAllByTestId("cell");

      fireEvent.mouseEnter(cells[0]);
      fireEvent.click(cells[0]);

      expect(defaultProps.setBoard).toHaveBeenCalled();
      const newBoardCall = defaultProps.setBoard.mock.calls[0][0];
      expect(newBoardCall[0][0]).toBe("shape1");
    });

    it("should not place shape when highlighted cells array is empty", () => {
      const outOfBoundsShape = {
        ...defaultProps,
        selectedShape: {
          symbol: "outOfBounds",
          coords: [[0, 10]], // Coordinates that will be out of bounds
        },
      };

      const { getAllByTestId } = render(<PolyBoard {...outOfBoundsShape} />);
      const cells = getAllByTestId("cell");

      fireEvent.mouseEnter(cells[0]);
      fireEvent.click(cells[0]);

      expect(outOfBoundsShape.setBoard).not.toHaveBeenCalled();
    });

    it("should not place shape in occupied position", () => {
      const occupiedBoard = mockBoard.map((row) => [...row]);
      occupiedBoard[0][0] = "occupied";

      const props = {
        ...defaultProps,
        board: occupiedBoard,
      };

      const { getAllByTestId } = render(<PolyBoard {...props} />);
      const cells = getAllByTestId("cell");

      fireEvent.mouseEnter(cells[0]);
      fireEvent.click(cells[0]);

      expect(props.setBoard).not.toHaveBeenCalled();
    });
  });

  describe("Shape Inventory Management", () => {
    it("should update shapes and select next shape after placement", () => {
      const startShapes = [
        { symbol: "first", coords: [[0, 0]] },
        { symbol: "second", coords: [[0, 0]] },
      ];

      const props = {
        ...defaultProps,
        shapes: startShapes,
        selectedShape: startShapes[0],
        setShapes: jest.fn((cb) => {
          const newShapes = cb(startShapes);
          return newShapes;
        }),
      };

      const { getAllByTestId } = render(<PolyBoard {...props} />);
      const cells = getAllByTestId("cell");

      fireEvent.mouseEnter(cells[0]);
      fireEvent.click(cells[0]);

      expect(props.setShapes).toHaveBeenCalled();
      expect(props.setSelectedShape).toHaveBeenCalledWith(
        expect.objectContaining({ symbol: "second" })
      );
    });

    it("should set selected shape to null when placing a last shape", () => {
      const lastShape = [{ symbol: "last", coords: [[0, 0]] }];

      const props = {
        ...defaultProps,
        shapes: lastShape,
        selectedShape: lastShape[0],
        setShapes: jest.fn((cb) => {
          const newShapes = cb(lastShape);
          return newShapes;
        }),
      };

      const { getAllByTestId } = render(<PolyBoard {...props} />);
      const cells = getAllByTestId("cell");

      fireEvent.mouseEnter(cells[0]);
      fireEvent.click(cells[0]);

      const setShapesCallback = props.setShapes.mock.calls[0][0];
      const emptyShapes = setShapesCallback(lastShape);
      expect(emptyShapes).toHaveLength(0);
      expect(props.setSelectedShape).toHaveBeenCalledWith(null);
    });
  });
});
