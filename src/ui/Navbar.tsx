import { Link } from "react-router-dom";
import "./Navbar.scss";

function Navbar() {
  return (
    <div className="navbar">
      <Link to="/main">
        <p>Main</p>
      </Link>

      <Link to="history">
        <p>History</p>
      </Link>
    </div>
  );
}

export default Navbar;
