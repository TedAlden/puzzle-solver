import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import QueenBoard from "./QueenBoard";

describe("N-Queens Board Integration Test", () => {
  test("Board array should have queen after clicking on empty cell", () => {
    // Initial board with no queens placed
    const initialBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    let board = [...initialBoard];
    // Mock the onClick method for the cells
    const handleMouseClickCellMock = jest.fn((row, col) => {
      const newBoard = board.map((rowArr, rowIndex) =>
        rowArr.map((cell, colIndex) =>
          rowIndex === row && colIndex === col ? (cell === 1 ? 0 : 1) : cell
        )
      );
      board = newBoard;
    });
    // Render the board
    const { getAllByRole } = render(
      <QueenBoard
        board={board}
        handleMouseClickCell={handleMouseClickCellMock}
      />
    );
    // Simulate click on the first cell (row 0, col 0)
    const cells = getAllByRole("cell");
    const firstCell = cells[0];
    fireEvent.click(firstCell);
    // Expect a 1 (queen) in this cell
    expect(board).toEqual([
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
  });

  test("Board array should not have queen after clicking on queen cell", () => {
    // Initial board with queen placed in (0, 0)
    const initialBoard = [
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    let board = [...initialBoard];
    // Mock the onClick method for the cells
    const handleMouseClickCellMock = jest.fn((row, col) => {
      const newBoard = board.map((rowArr, rowIndex) =>
        rowArr.map((cell, colIndex) =>
          rowIndex === row && colIndex === col ? (cell === 1 ? 0 : 1) : cell
        )
      );
      board = newBoard;
    });
    // Render the board
    const { getAllByRole } = render(
      <QueenBoard
        board={board}
        handleMouseClickCell={handleMouseClickCellMock}
      />
    );
    // Simulate click on the first cell (row 0, col 0)
    const cells = getAllByRole("cell");
    const firstCell = cells[0];
    fireEvent.click(firstCell);
    // Expect a 0 (empty) in this cell
    expect(board).toEqual([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
  });

  test("UI should display queen after clicking on empty cell", async () => {
    // Initial board with no queens placed
    const initialBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    let board = [...initialBoard];
    // Mock the onClick method for the cells
    const handleMouseClickCellMock = jest.fn((row, col) => {
      const newBoard = board.map((rowArr, rowIndex) =>
        rowArr.map((cell, colIndex) =>
          rowIndex === row && colIndex === col ? (cell === 1 ? 0 : 1) : cell
        )
      );
      board = newBoard;
    });
    // Render the board
    const { getAllByRole, rerender } = render(
      <QueenBoard
        board={board}
        handleMouseClickCell={handleMouseClickCellMock}
      />
    );
    // Simulate click on the first cell (row 0, col 0) to place a queen
    const cells = getAllByRole("cell");
    const firstCell = cells[0];
    fireEvent.click(firstCell);
    // Re-render the board
    rerender(
      <QueenBoard
        board={board}
        handleMouseClickCell={handleMouseClickCellMock}
      />
    );
    // Expect there to now be a queen in the first cell
    await waitFor(() => {
      expect(firstCell).toHaveTextContent("♛");
    });
  });

  test("UI should not display queen after clicking on queen cell", async () => {
    // Initial board with queen placed
    const initialBoard = [
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    let board = [...initialBoard];
    // Mock the onClick method for the cells
    const handleMouseClickCellMock = jest.fn((row, col) => {
      const newBoard = board.map((rowArr, rowIndex) =>
        rowArr.map((cell, colIndex) =>
          rowIndex === row && colIndex === col ? (cell === 1 ? 0 : 1) : cell
        )
      );
      board = newBoard;
    });
    // Render the board
    const { getAllByRole, rerender } = render(
      <QueenBoard
        board={board}
        handleMouseClickCell={handleMouseClickCellMock}
      />
    );
    // Simulate click on the first cell (row 0, col 0) to remove the queen
    const cells = getAllByRole("cell");
    const firstCell = cells[0];
    fireEvent.click(firstCell);
    // Re-render the board
    rerender(
      <QueenBoard
        board={board}
        handleMouseClickCell={handleMouseClickCellMock}
      />
    );
    // Expect the queen to be now removed
    await waitFor(() => {
      expect(firstCell).not.toHaveTextContent("♛");
    });
  });
});
