import './Navbar.css';
import { Link } from 'react-router-dom';

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
