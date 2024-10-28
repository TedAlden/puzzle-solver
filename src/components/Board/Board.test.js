import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Board from './Board';

describe('N-Queens Board Integration Test', () => {
  test('Board array should have queen after clicking on empty cell', () => {
    const board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];

    const setBoardMock = jest.fn();

    const { getAllByRole } = render(<Board board={board} setBoard={setBoardMock} />);

    // Simulate click on the first cell (row 0, col 0)
    const cells = getAllByRole('cell');
    const firstCell = cells[0];
    fireEvent.click(firstCell);

    // Expect a 1 (queen) in this cell
    expect(setBoardMock).toHaveBeenCalledWith([
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
  });

  test('Board array should not have queen after clicking on queen cell', () => {
    const board = [
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];

    const setBoardMock = jest.fn();

    const { getAllByRole } = render(<Board board={board} setBoard={setBoardMock} />);

    // Simulate click on the first cell (row 0, col 0)
    const cells = getAllByRole('cell');
    const firstCell = cells[0];
    fireEvent.click(firstCell);

    // Expect a 0 (no queen) in this cell
    expect(setBoardMock).toHaveBeenCalledWith([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
  });

  test('UI should display queen after clicking on empty cell', async () => {
    const initialBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    
    // Mock setter
    let board = [...initialBoard];
    const setBoardMock = jest.fn();
    setBoardMock.mockImplementation((newBoard) => {
      board = newBoard;
    });
  
    const { getAllByRole, rerender } = render(<Board board={board} setBoard={setBoardMock} />);
  
    // Simulate click on the first cell (row 0, col 0)
    const cells = getAllByRole('cell');
    const firstCell = cells[0];
    fireEvent.click(firstCell);
  
    // Update the board after placing the queen
    const updatedBoard = [...board];
    updatedBoard[0][0] = 1;
    setBoardMock(updatedBoard);
    rerender(<Board board={updatedBoard} setBoard={setBoardMock} />);
  
    // After clicking, expect a queen to be displayed
    await waitFor(() => {
      expect(firstCell).toHaveTextContent('♛');
    });
  });

  test('UI should not display queen after clicking on queen cell', async () => {
    const initialBoard = [
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];

    // Mock setter
    let board = [...initialBoard];
    const setBoardMock = jest.fn();
    setBoardMock.mockImplementation((newBoard) => {
      board = newBoard;
    });
  
    const { getAllByRole, rerender } = render(<Board board={board} setBoard={setBoardMock} />);
  
    // Simulate click on the first cell (row 0, col 0)
    const cells = getAllByRole('cell');
    const firstCell = cells[0];
    fireEvent.click(firstCell);
  
    // Update the board after placing the queen
    const updatedBoard = [...board];
    updatedBoard[0][0] = 0;
    setBoardMock(updatedBoard);
    rerender(<Board board={updatedBoard} setBoard={setBoardMock} />);
  
    // After clicking, expect a queen to not be displayed
    await waitFor(() => {
      expect(firstCell).not.toHaveTextContent('♛');
    });
  });
});
