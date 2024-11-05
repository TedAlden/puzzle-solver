import './Navbar.css';
import { Link } from 'react-router-dom';

/**
 * A component for the navbar, displayed at the top of the screen, to navigate
 * between the home page and different puzzle pages.
 * 
 * @returns {React.JSX.Element}
 */
function Navbar() {
  return (
    <div className="navbar">
      <div className="navbarItem">
        <Link to="/">Home</Link>
      </div>
      <div className="navbarItem">
        <Link to="/nqueen">N-Queens</Link>
      </div>
      <div className="navbarItem">
        <Link to="/polysphere">Polyspheres</Link>
      </div>
    </div>
  )
}

export default Navbar;
