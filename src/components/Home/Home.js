import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <h1>Puzzle Solver</h1>
      <Link to="/nqueen" className="puzzle-option">
        <div className="icon">👑</div>
        <div className="puzzle-info">
          <div className="puzzle-title">N-Queens</div>
          <p className="puzzle-description">Solve the N-Queens problem by placing queens on a chessboard so that no two queens can attack each other.</p>
        </div>
      </Link>

      <Link to="/polysphere" className="puzzle-option">
        <div className="icon">🧩</div>
        <div className="puzzle-info">
          <div className="puzzle-title">Polyspheres</div>
          <p className="puzzle-description">Place unique shapes on a 5x11 board to solve the Polysphere puzzle.</p>
        </div>
      </Link>
    </div>
  );
}

export default Home;
