import React from 'react';
import { render, fireEvent } from '@testing-library/react';
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

    const setBoardMock = jest.fn(); // Mock function to track state updates

    const { getAllByRole } = render(<Board board={board} setBoard={setBoardMock} />);

    // Simulate click on the first cell (row 0, col 0)
    const cells = getAllByRole('cell');
    fireEvent.click(cells[0]);

    // Assert that the setBoard function was called with the updated board
    expect(setBoardMock).toHaveBeenCalledWith([
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
  });

  test('UI should display queen after clicking on empty cell', () => {
    const board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];

    const setBoardMock = jest.fn();

    const { getAllByRole, getByText } = render(<Board board={board} setBoard={setBoardMock} />);

    // Simulate click on the first cell (row 0, col 0)
    const cells = getAllByRole('cell');
    fireEvent.click(cells[0]);

    // After clicking, the queen should be displayed
    expect(getByText('♛')).toBeInTheDocument();
  });

  test('UI should toggle showing queen after multiple clicks', () => {
    const board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];

    const setBoardMock = jest.fn();

    const { getAllByRole, getByText } = render(<Board board={board} setBoard={setBoardMock} />);

    // Simulate click on the first cell (row 0, col 0)
    const cells = getAllByRole('cell');
    const firstCell = cells[0];

    // Verify that no queen is placed initially
    expect(firstCell).not.toHaveTextContent('♛');

    // Click the cell to place a queen
    fireEvent.click(firstCell);

    // Verify that the queen is now placed in that cell
    expect(firstCell).toHaveTextContent('♛');

    // Click the same cell again to remove the queen
    fireEvent.click(firstCell);

    // Verify that the queen is removed
    expect(firstCell).not.toHaveTextContent('♛');
  });
});
