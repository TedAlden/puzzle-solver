import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import NQueenPuzzle from './components/NQueenPuzzle/NQueenPuzzle';

describe('App Component', () => {
  test('renders the app header', () => {
    // Render the App component
    render(<App />);

    // Check if the header with the expected text is in the document
    const headerElement = screen.getByText(/Welcome to the puzzle solver!/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('renders the NQueenPuzzle component', () => {
    // Render the App component
    const { getByText } = render(<App />);

    // Check if the title is rendered (in the NQueenPuzzle component)
    expect(getByText("The N-Queens Puzzle")).toBeInTheDocument();
  });
});
