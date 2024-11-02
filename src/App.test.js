import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App Component', () => {
  test('renders the app header', () => {
    // Render the App component
    render(<App />);

    // Check if the header with the expected text is in the document
    const headerElement = screen.getByText(/Welcome to the Puzzle Solver/i);
    expect(headerElement).toBeInTheDocument();
  });
});
