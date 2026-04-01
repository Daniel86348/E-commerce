import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = "https://ecommerce-api-production-f3f2.up.railway.app/api";

interface ProfileData {
  _id:   string;
  name:  string;
  email: string;
  role:  string;
}

export default function Profile() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al cargar perfil.");
        setProfile(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error inesperado.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <p style={{ color: "#666" }}>Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <p className="msg msg--error">{error || "No se pudo cargar el perfil."}</p>
          <button className="btn-primary" style={{ marginTop: "1rem" }} onClick={() => navigate("/login")}>
            Volver al login
          </button>
        </div>
      </div>
    );
  }

  const initials = profile.name
    ? profile.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : profile.email[0].toUpperCase();

  const isAdmin = profile.role === "admin";

  return (
    <div className="auth-wrapper">
      <div className="auth-card profile-card">

        <div className="profile-header">
          <div className={`avatar ${isAdmin ? "avatar--admin" : "avatar--cliente"}`}>
            {initials}
          </div>
          <div>
            <h2>{profile.name}</h2>
            <p style={{ fontSize: "0.875rem", color: "#666", marginTop: "2px" }}>
              {profile.email}
            </p>
          </div>
        </div>

        <div className="profile-body">
          <div className="profile-row">
            <span className="profile-label">Nombre</span>
            <span className="profile-value">{profile.name}</span>
          </div>
          <div className="profile-row">
            <span className="profile-label">Correo</span>
            <span className="profile-value">{profile.email}</span>
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
