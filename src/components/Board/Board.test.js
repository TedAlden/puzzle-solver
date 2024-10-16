import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Board from './Board';

describe('N-Queens Board Integration Test', () => {
  test('Should toggle queen placement on click', () => {
    const board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];

    const setBoardMock = jest.fn(); // Mock function to track state updates

    const { getAllByRole } = render(<Board board={board} setBoard={setBoardMock} />);

    // Simulate click on the first cell (row 0, col 0)
    const cells = getAllByRole('button');
    fireEvent.click(cells[0]);

    // Assert that the setBoard function was called with the updated board
    expect(setBoardMock).toHaveBeenCalledWith([
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]);
  });

  test('Should display queen after clicking on cell', () => {
    const board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];

    const setBoardMock = jest.fn();

    const { getAllByRole, getByText } = render(<Board board={board} setBoard={setBoardMock} />);

    // Simulate click on the first cell (row 0, col 0)
    const cells = getAllByRole('button');
    fireEvent.click(cells[0]);

    // After clicking, the queen should be displayed
    expect(getByText('♛')).toBeInTheDocument();
  });
});
