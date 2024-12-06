import { render, fireEvent, screen } from "@testing-library/react";
import BoardSave from "./BoardSave";

describe("BoardSave", () => {
  const board = [
    [
      ["A", "B"],
      ["C", "D"],
    ],
    [
      ["E", "F"],
      ["G", "H"],
    ],
  ];

  it("should export the board as JSON", () => {
    render(<BoardSave board={board} />);
    const jsonButton = screen.getByTestId("export-json");

    const createObjectURLMock = jest.fn();
    global.URL.createObjectURL = createObjectURLMock;

    fireEvent.click(jsonButton);

    expect(createObjectURLMock).toHaveBeenCalled();
    const blob = createObjectURLMock.mock.calls[0][0];
    expect(blob.type).toBe("application/json");

    const reader = new FileReader();
    reader.onload = () => {
      const result = JSON.parse(reader.result);
      expect(result.board).toEqual(board);
      expect(result.placedPieces).toHaveLength(8);
    };
    reader.readAsText(blob);
  });

  it("should handle null cells correctly when exporting as JSON", () => {
    const boardWithNull = [
      [
        ["A", null],
        ["C", "D"],
      ],
      [
        ["E", "F"],
        ["G", "H"],
      ],
    ];
    render(<BoardSave board={boardWithNull} />);
    const jsonButton = screen.getByTestId("export-json");

    const createObjectURLMock = jest.fn();
    global.URL.createObjectURL = createObjectURLMock;

    fireEvent.click(jsonButton);

    expect(createObjectURLMock).toHaveBeenCalled();
    const blob = createObjectURLMock.mock.calls[0][0];
    expect(blob.type).toBe("application/json");

    const reader = new FileReader();
    reader.onload = () => {
      const result = JSON.parse(reader.result);
      expect(result.board).toEqual(boardWithNull);
      expect(result.placedPieces).toHaveLength(7); // Only 7 pieces should be placed
    };
    reader.readAsText(blob);
  });

  it("should export the board as CSV", () => {
    render(<BoardSave board={board} />);
    const csvButton = screen.getByTestId("export-csv");

    const createObjectURLMock = jest.fn();
    global.URL.createObjectURL = createObjectURLMock;

    fireEvent.click(csvButton);

    expect(createObjectURLMock).toHaveBeenCalled();
    const blob = createObjectURLMock.mock.calls[0][0];
    expect(blob.type).toBe("text/csv");

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const expectedCSV = `Layer,Row,Column,Piece
0,0,0,A
0,0,1,B
0,1,0,C
0,1,1,D
1,0,0,E
1,0,1,F
1,1,0,G
1,1,1,H`;
      expect(result).toBe(expectedCSV);
    };
    reader.readAsText(blob);
  });

  it("should handle null cells correctly when exporting as CSV", () => {
    const boardWithNull = [
      [
        ["A", null],
        ["C", "D"],
      ],
      [
        ["E", "F"],
        ["G", "H"],
      ],
    ];
    render(<BoardSave board={boardWithNull} />);
    const csvButton = screen.getByTestId("export-csv");

    const createObjectURLMock = jest.fn();
    global.URL.createObjectURL = createObjectURLMock;

    fireEvent.click(csvButton);

    expect(createObjectURLMock).toHaveBeenCalled();
    const blob = createObjectURLMock.mock.calls[0][0];
    expect(blob.type).toBe("text/csv");

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const expectedCSV = `Layer,Row,Column,Piece
0,0,0,A
0,0,1,
0,1,0,C
0,1,1,D
1,0,0,E
1,0,1,F
1,1,0,G
1,1,1,H`;
      expect(result).toBe(expectedCSV);
    };
    reader.readAsText(blob);
  });
});
