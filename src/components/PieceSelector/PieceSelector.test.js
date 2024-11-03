import { render, screen, fireEvent } from '@testing-library/react';
import PieceSelector from './PieceSelector';

describe('PieceSelector test here', () => {

  const samples = [
    {
      symbol: "A",
      coords: [[0, 0], [0, 1], [1, 1], [2, 1], [2, 0]],
      colour: "#ff0000"
    },
    {
      symbol: "B",
      coords: [[0, 0], [1, 0], [1, 1], [1, 2], [2, 2]],
      colour: "#00ff00"
    }
  ];

  const sampleSelectedShape = jest.fn();

  beforeEach(() => {
    sampleSelectedShape.mockClear();
  });

  it('render button check', () => {
    render(
      <PieceSelector
        shapes={samples}
        selectedShape={samples[0]}
        setSelectedShape={sampleSelectedShape}
      />
    );

    expect(screen.getByText('Flip')).toBeInTheDocument();
    expect(screen.getByText('Prev')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Rotate')).toBeInTheDocument();
  });

  it('next button check', () => {
    render(
      <PieceSelector
        shapes={samples}
        selectedShape={samples[0]}
        setSelectedShape={sampleSelectedShape}
      />
    );

    fireEvent.click(screen.getByText('Next'));
    expect(sampleSelectedShape).toHaveBeenCalledWith(samples[1]);
  });

  it('Prev button check', () => {
    render(
      <PieceSelector
        shapes={samples}
        selectedShape={samples[1]}
        setSelectedShape={sampleSelectedShape}
      />
    );

    fireEvent.click(screen.getByText('Prev'));
    expect(sampleSelectedShape).toHaveBeenCalledWith(samples[0]);
  });

  
  it('rotate button check', () => {
    const initialShape = {
      symbol: "A",
      coords: [[0, 0], [0, 1], [1, 1], [2, 1], [2, 0]],
      colour: "#ff0000"
    };

    render(
      <PieceSelector
        shapes={samples}
        selectedShape={initialShape}
        setSelectedShape={sampleSelectedShape}
      />
    );

    fireEvent.click(screen.getByText('Rotate'));

    const expectedRotatedShape = {
      symbol: "A",
      coords: [[0, 2], [1, 2], [1, 1], [1, 0], [0, 0]],
      colour: "#ff0000"
    };
    
    expect(sampleSelectedShape).toHaveBeenCalledWith(expectedRotatedShape);
  });

  it('flip button check', () => {
    const initialShape = {
      symbol: "A",
      coords: [[0, 0], [0, 1], [1, 1], [2, 1], [2, 0]],
      colour: "#ff0000"
    };

    render(
      <PieceSelector
        shapes={samples}
        selectedShape={initialShape}
        setSelectedShape={sampleSelectedShape}
      />
    );

    fireEvent.click(screen.getByText('Flip'));
    
    const expectedFlippedShape = {
      symbol: "A",
      coords: [[2, 0], [2, 1], [1, 1], [0, 1], [0, 0]],
      colour: "#ff0000"
    };
    
    expect(sampleSelectedShape).toHaveBeenCalledWith(expectedFlippedShape);
  });
});