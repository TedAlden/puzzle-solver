import "./App.css";

import {
  MemoryRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Home from "../pages/Home/Home";
import NQueenPuzzle from "../pages/NQueenPuzzle/NQueenPuzzle";
import PolyspherePuzzle from "../pages/PolyspherePuzzle/PolyspherePuzzle";
import PyramidPuzzle from "../pages/PyramidPuzzle/PyramidPuzzle";

/**
 * Main app component.
 *
 * @returns {React.JSX.Element}
 */
function App() {
  // Forced to use MemoryRouter. The app is deployed to a subdirectory within
  // GitHub pages which caused issues with URL-based routing.
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nqueen" element={<NQueenPuzzle />} />
          <Route path="/polysphere" element={<PolyspherePuzzle />} />
          <Route path="/pyramid" element={<PyramidPuzzle />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
