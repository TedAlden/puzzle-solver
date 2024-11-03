import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShapePreview from './ShapePreview';

describe('ShapePreview Component', () => {
  // Mock shape data
  const mockShape = {
    coords: [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1]
    ],
    colour: '#FF0000'
  };

  const mockLShape = {
    coords: [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 2]
    ],
    colour: '#00FF00'
  };

  test('renders without crashing', () => {
    const { container } = render(<ShapePreview selectedShape={mockShape} />);
    expect(container).toBeInTheDocument();
  });

  test('renders SVG element with correct dimensions', () => {
    const { container } = render(<ShapePreview selectedShape={mockShape} />);
    const svg = container.querySelector('svg');
    
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '100'); // 5 * 20 (previewcols * tilesize)
    expect(svg).toHaveAttribute('height', '100'); // 5 * 20 (previewrows * tilesize)
  });

  test('renders correct number of rectangles for square shape', () => {
    const { container } = render(<ShapePreview selectedShape={mockShape} />);
    const rects = container.querySelectorAll('rect');
    
    expect(rects).toHaveLength(4); // Square shape 4 tiles
  });

  test('renders correct number of rectangles for L shape', () => {
    const { container } = render(<ShapePreview selectedShape={mockLShape} />);
    const rects = container.querySelectorAll('rect');
    
    expect(rects).toHaveLength(4); // L shape 4 tiles
  });

  test('applies correct color to rectangles', () => {
    const { container } = render(<ShapePreview selectedShape={mockShape} />);
    const rects = container.querySelectorAll('rect');
    
    rects.forEach(rect => {
      expect(rect).toHaveAttribute('fill', '#FF0000');
    });
  });

  test('centers shapes correctly', () => {
    const { container } = render(<ShapePreview selectedShape={mockShape} />);
    const rects = Array.from(container.querySelectorAll('rect'));
    
    // Check if rectangles are centered by verifying their positions
    const positions = rects.map(rect => ({
      x: parseFloat(rect.getAttribute('x')),
      y: parseFloat(rect.getAttribute('y'))
    }));

    // Calculate the bounding box
    const minX = Math.min(...positions.map(p => p.x));
    const maxX = Math.max(...positions.map(p => p.x));
    const minY = Math.min(...positions.map(p => p.y));
    const maxY = Math.max(...positions.map(p => p.y));

    // Calculate center bounding box
    const centerX = (minX + maxX + 20) / 2; // Add tilesize(20) to maxX
    const centerY = (minY + maxY + 20) / 2; // Add tilesize(20) to maxY

    // Check if center is approximately at the middle of the preview
    expect(centerX).toBeCloseTo(50, 0); // Half of SVG width (100)
    expect(centerY).toBeCloseTo(50, 0); // Half of SVG height (100)
  });

  test('SVG has correct styling', () => {
    const { container } = render(<ShapePreview selectedShape={mockShape} />);
    const svg = container.querySelector('svg');
    
    expect(svg).toHaveStyle({
      backgroundColor: '#374151',
      borderRadius: '8px',
      padding: '4px'
    });
  });
});