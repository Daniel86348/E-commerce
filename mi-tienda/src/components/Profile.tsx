import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, token, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <p style={{ marginBottom: "1rem", color: "#666" }}>
            Debes iniciar sesión para ver tu perfil.
          </p>
          <button className="btn-primary" onClick={() => navigate("/login")}>
            Ir al login
          </button>
        </div>
      </div>
    );
  }

  const initials = user.name
    ? user.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : user.email[0].toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card profile-card">

        <div className="profile-header">
          <div className={`avatar ${isAdmin ? "avatar--admin" : "avatar--cliente"}`}>
            {initials}
          </div>
          <div>
            <h2>{user.name || user.email}</h2>
            <span className={`role-badge ${isAdmin ? "role-badge--admin" : "role-badge--cliente"}`}>
              {isAdmin ? "Administrador" : "Cliente"}
            </span>
          </div>
        </div>

        <div className="profile-body">
          <div className="profile-row">
            <span className="profile-label">Correo</span>
            <span className="profile-value">{user.email}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Rol</span>
            <span className="profile-value">{isAdmin ? "Admin" : "Cliente"}</span>
          </div>
          {user._id && (
            <div className="profile-row">
              <span className="profile-label">ID</span>
              <span className="profile-value profile-value--mono">{user._id}</span>
            </div>
          )}
          <div className="profile-row">
            <span className="profile-label">Token JWT</span>
            <span className="profile-value profile-value--mono">
              {token ? token.slice(0, 24) + "…" : "—"}
            </span>
          </div>
        </div>

        {isAdmin && (
          <div className="profile-actions">
            <p className="profile-actions__label">Acciones de administrador</p>
            <button className="btn-secondary" onClick={() => navigate("/productos/nuevo")}>
              + Crear producto
            </button>
          </div>
        )}

        <button className="btn-danger" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
