import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div>
      <Link to="/main">mainPage</Link>

      <Link to="history">History</Link>
    </div>
  );
}

export default Navbar;
