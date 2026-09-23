import { Link } from "react-router-dom";
import BrandMark from "../components/BrandMark";

function NotFound() {
  return (
    <main className="auth-page">
      <title>Página no encontrada — Eco</title>
      <meta name="robots" content="noindex" />

      <div className="auth-card" style={{ textAlign: "center" }}>
        <div className="auth-brand" style={{ justifyContent: "center" }}>
          <BrandMark size={28} />
          <span className="auth-wordmark">Eco</span>
        </div>

        <h1 className="auth-heading">Esto no existe</h1>
        <p className="auth-subtitle">
          La página que buscás no está o se movió de lugar.
        </p>

        <Link to="/login" className="btn btn-primary" style={{ width: "100%" }}>
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
