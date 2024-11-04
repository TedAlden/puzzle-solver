import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PolyspherePuzzle from './PolyspherePuzzle';

// Mock the worker creation
jest.mock('../../workers/createPolysphereWorker', () => ({
  __esModule: true,
  default: () => ({
    terminate: jest.fn(),
    addEventListener: jest.fn(),
    postMessage: jest.fn(),
    removeEventListener: jest.fn()
  })
}));

describe('to test PolyspherePuzzle file', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('to check that polysphere puzzle is rendering', () => {
    render(<PolyspherePuzzle />);
    expect(screen.getByText('The Polysphere Puzzle')).toBeInTheDocument();
  });

  it('to check the that UI is rendering buttons', () => {
    render(<PolyspherePuzzle />);
    expect(screen.getByText('Solve Puzzle')).toBeInTheDocument();
    expect(screen.getByText('Clear Board')).toBeInTheDocument();
    expect(screen.getByText('Undo')).toBeInTheDocument();
  });

  it('to check UI renders the keyboard controls', () => {
    render(<PolyspherePuzzle />);
    expect(screen.getByText('Keyboard Controls')).toBeInTheDocument();
    expect(screen.getByText('R : Rotate piece')).toBeInTheDocument();
    expect(screen.getByText('F : Flip piece')).toBeInTheDocument();
  });

  it('to check clear functionality', () => {
    render(<PolyspherePuzzle />);
    const clearButton = screen.getByText('Clear Board');
    fireEvent.click(clearButton);
    expect(screen.getByText('Undo')).toBeDisabled();
  });

  it('to check solve functionality', () => {
    render(<PolyspherePuzzle />);
    const solveButton = screen.getByText('Solve Puzzle');
    
    fireEvent.click(solveButton);
    expect(screen.getByText('Solving...')).toBeInTheDocument();
  });

  it('to check escape functionality', () => {
    render(<PolyspherePuzzle />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.getByText('Undo')).toBeDisabled();
    fireEvent.keyDown(window, { key: 's' });
    expect(screen.getByText('Solving...')).toBeInTheDocument();
  });

  it('undo button is initially disabled', () => {
    render(<PolyspherePuzzle />);
    expect(screen.getByText('Undo')).toBeDisabled();
  });
  
});