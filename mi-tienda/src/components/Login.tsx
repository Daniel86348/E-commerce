import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = "https://ecommerce-api-production-f3f2.up.railway.app/api";

export default function Login() {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Credenciales incorrectas.");

      const userData = data.user ?? {
        _id:   data._id   ?? null,
        name:  data.name  ?? email.split("@")[0],
        email: data.email ?? email,
        role:  data.role  ?? "cliente",
      };
      login(userData, data.token);
      navigate("/perfil");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Bienvenido</h1>
          <p>Ingresa a tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="juan@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <p className="msg msg--error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="auth-footer">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
