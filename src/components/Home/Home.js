import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to the Puzzle Solver</h1>
      <p>Select a puzzle from the menu to get started.</p>
      <ul>
        <li><Link to="/nqueen">The N-Queens Puzzle</Link></li>
        <li><Link to="/polysphere">Polysphere Puzzle</Link></li>
      </ul>
    </div>
  );
}

export default Home;
