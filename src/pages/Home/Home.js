import "./Home.css";
import { Link } from "react-router-dom";

/**
 * A component for the homepage, displaying links to pages with each individual
 * puzzle.
 *
 * @returns {React.JSX.Element}
 */
function Home() {
  return (
    <div className="home-container">
      <h2>Puzzle Solver</h2>
      <Link to="/nqueen" className="puzzle-option">
        <div className="icon">👑</div>
        <div className="puzzle-info">
          <div className="puzzle-title">N-Queens</div>
          <p className="puzzle-description">
            Solve the N-Queens problem by placing queens on a chessboard so that
            no two queens can attack each other.
          </p>
        </div>
      </Link>
      <Link to="/polysphere" className="puzzle-option">
        <div className="icon">🧩</div>
        <div className="puzzle-info">
          <div className="puzzle-title">Polyspheres</div>
          <p className="puzzle-description">
            Place unique shapes on a 5x11 board to solve the Polysphere puzzle.
          </p>
        </div>
      </Link>
      <Link to="/pyramid" className="puzzle-option">
        <div className="icon">📐</div>
        <div className="puzzle-info">
          <div className="puzzle-title">Polysphere Pyramid</div>
          <p className="puzzle-description">
            Place shapes on a 3D pyramid to solve the Polysphere Pyramid puzzle.
          </p>
        </div>
      </Link>
    </div>
  );
}

export default Home;
