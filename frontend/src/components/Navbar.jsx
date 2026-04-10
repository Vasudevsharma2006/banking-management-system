import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaMoon, FaSun, FaUniversity } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, theme, toggleTheme } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <FaUniversity /> BlueTrust
      </Link>

      <nav>
        <NavLink to="/">Home</NavLink>
        {!user && <NavLink to="/login">Login/Register</NavLink>}
        {user && <NavLink to="/dashboard">Dashboard</NavLink>}
        {user && <NavLink to="/transfer">Transfer</NavLink>}
        {user && <NavLink to="/history">History</NavLink>}
        {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
      </nav>

      <div className="nav-actions">
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle dark mode">
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </button>
        {user && (
          <button className="btn-outline" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;

