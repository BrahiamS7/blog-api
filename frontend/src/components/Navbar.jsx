import { useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../services/auth";

function Navbar() {
  const navigate = useNavigate();
  const usuario = getCurrentUser();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">B</span>

        <span>Blog API</span>
      </div>

      <div className="navbar-actions">
        {usuario && (
          <div className="user-info">
            <div className="user-avatar">
              {usuario.email.charAt(0).toUpperCase()}
            </div>

            <div className="user-details">
              <span className="user-email">
                {usuario.email}
              </span>

              <span className="user-role">
                {usuario.rol}
              </span>
            </div>
          </div>
        )}

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

export default Navbar;